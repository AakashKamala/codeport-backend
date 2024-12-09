const { GoogleGenerativeAI } = require("@google/generative-ai");
const fsPromises = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

if (!process.env.KEY) {
    throw new Error("API key is missing in environment variables.");
}

const gemini = async (prompt) => {
    console.log(prompt)
    try {
        const genAI = new GoogleGenerativeAI(process.env.KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const responseText = await result.response.text();
        console.log(responseText);

        const answer= responseText.replace(/```.*?\n|```$/g, "");

        // return responseText;
        return answer;
    } catch (error) {
        console.error("Error in gemini function:", error);
        throw error;
    }
};

const createFiles = async (req, res) => {
    try {
        const writeDir = path.join(__dirname, "write");
        const appendDir = path.join(__dirname, "append");

        await fsPromises.mkdir(writeDir, { recursive: true });
        await fsPromises.mkdir(appendDir, { recursive: true });

        const uuid1 = uuidv4();
        const uuid2 = uuidv4();

        res.status(200).json({ uuid1, uuid2 });
    } catch (error) {
        console.error("Error in createFiles function:", error);
        res.status(500).json({ error: "Failed to create directories." });
    }
};


const send = async (req, res) => {
    try {
        const { prompt, uuid1 } = req.body;

        const filePath = path.join(__dirname, "./write", `${uuid1}.html`);
        const answer = await gemini(prompt);

        await fsPromises.writeFile(filePath, answer);

        const fileContent = await fsPromises.readFile(filePath, "utf-8");
        res.status(200).type("html").send(fileContent);
    } catch (error) {
        console.error("Error in send function:", error);
        res.status(500).json({ error: "Failed to write and send the file." });
    }
};


const accept = async (req, res) => {
    try {
        const { uuid1, uuid2 } = req.body;

        const toAppendPath = path.join(__dirname, "write", `${uuid1}.html`);
        const appendContent = await fsPromises.readFile(toAppendPath, "utf-8");

        const filePath = path.join(__dirname, "append", `${uuid2}.html`);
        await fsPromises.appendFile(filePath, appendContent);

        const fileContent = await fsPromises.readFile(filePath, "utf-8");
        res.status(200).type("html").send(fileContent);
    } catch (error) {
        console.error("Error in accept function:", error);
        res.status(500).json({ error: "Failed to append and send the file." });
    }
};

module.exports = { createFiles, send, accept };
