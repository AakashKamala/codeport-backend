// // const { GoogleGenerativeAI } = require("@google/generative-ai");
// // import { GoogleGenAI } from "@google/genai";
// const fsPromises = require("fs").promises;
// const path = require("path");
// const { v4: uuidv4 } = require("uuid");
// require("dotenv").config();

// if (!process.env.KEY) {
//     throw new Error("API key is missing in environment variables.");
// }


// // import { GoogleGenAI } from "@google/genai";

// // const ai = new GoogleGenAI({ apiKey: process.env.KEY });

// (async () => {
//     const { GoogleGenerativeAI } = await import('@google/genai');
//     const genAI = new GoogleGenerativeAI(process.env.KEY);
  
//     // Your logic here
//   })();

// // async function main() {
// //   const response = await ai.models.generateContent({
// //     model: "gemini-2.0-flash",
// //     contents: "Explain how AI works",
// //   });
// //   console.log(response.text);
// // }

// // await main();

// const gemini = async (prompt) => {
//     console.log(prompt)
//     try {
//         // const genAI = new GoogleGenerativeAI(process.env.KEY);
//         // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//         // const result = await model.generateContent(prompt);
//         // const responseText = await result.response.text();
//         // console.log(responseText);

//         // const answer= responseText.replace(/```.*?\n|```$/g, "");

//         // // return responseText;
//         // return answer;





//         const response = await ai.models.generateContent({
//             model: "gemini-2.0-flash",
//             contents: "Explain how AI works",
//           });


//           const answer= response.replace(/```.*?\n|```$/g, "");

//         return answer;



//     } catch (error) {
//         console.error("Error in gemini function:", error);
//         throw error;
//     }
// };















// const fsPromises = require("fs").promises;
// const path = require("path");
// const { v4: uuidv4 } = require("uuid");
// require("dotenv").config();

// if (!process.env.KEY) {
//   throw new Error("API key is missing in environment variables.");
// }

// let model; // We'll initialize this once and reuse it

// (async () => {
//   const { GoogleGenerativeAI } = await import("@google/genai");

//   const genAI = new GoogleGenerativeAI(process.env.KEY);

//   model = genAI.getGenerativeModel({
//     model: "gemini-1.5-flash", // or "gemini-2.0-pro" based on your plan
//   });
// })();

// const gemini = async (prompt) => {
//   try {
//     if (!model) {
//       throw new Error("Model is not initialized yet.");
//     }

//     const result = await model.generateContent(prompt);
//     const response = await result.response.text();

//     const answer = response.replace(/```.*?\n|```$/g, "");
//     return answer;
//   } catch (error) {
//     console.error("Error in gemini function:", error);
//     throw error;
//   }
// };

// module.exports = { gemini };


// const createFiles = async (req, res) => {
//     try {
//         const writeDir = path.join(__dirname, "write");
//         const appendDir = path.join(__dirname, "append");

//         await fsPromises.mkdir(writeDir, { recursive: true });
//         await fsPromises.mkdir(appendDir, { recursive: true });

//         const uuid1 = uuidv4();
//         const uuid2 = uuidv4();

//         res.status(200).json({ uuid1, uuid2 });
//     } catch (error) {
//         console.error("Error in createFiles function:", error);
//         res.status(500).json({ error: "Failed to create directories." });
//     }
// };


// const send = async (req, res) => {
//     try {
//         const { prompt, uuid1 } = req.body;

//         const filePath = path.join(__dirname, "./write", `${uuid1}.html`);
//         const answer = await gemini(prompt);

//         await fsPromises.writeFile(filePath, answer);

//         const fileContent = await fsPromises.readFile(filePath, "utf-8");
//         res.status(200).type("html").send(fileContent);
//     } catch (error) {
//         console.error("Error in send function:", error);
//         res.status(500).json({ error: "Failed to write and send the file." });
//     }
// };


// const accept = async (req, res) => {
//     try {
//         const { uuid1, uuid2 } = req.body;

//         const toAppendPath = path.join(__dirname, "write", `${uuid1}.html`);
//         const appendContent = await fsPromises.readFile(toAppendPath, "utf-8");

//         const filePath = path.join(__dirname, "append", `${uuid2}.html`);
//         await fsPromises.appendFile(filePath, appendContent);

//         const fileContent = await fsPromises.readFile(filePath, "utf-8");
//         res.status(200).type("html").send(fileContent);
//     } catch (error) {
//         console.error("Error in accept function:", error);
//         res.status(500).json({ error: "Failed to append and send the file." });
//     }
// };

// module.exports = { createFiles, send, accept };



























const fsPromises = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

if (!process.env.KEY) {
  throw new Error("API key is missing in environment variables.");
}

let modelPromise;

// ✅ Lazy-load the model safely (only once)
const getModel = async () => {
  if (!modelPromise) {
    modelPromise = (async () => {
      const { GoogleGenerativeAI } = await import("@google/genai");
      const genAI = new GoogleGenerativeAI(process.env.KEY);
      return genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
      });
    })();
  }
  return modelPromise;
};

// ✅ Gemini handler
const gemini = async (prompt) => {
  try {
    const model = await getModel();
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    const answer = response.replace(/```.*?\n|```$/g, "");
    return answer;
  } catch (error) {
    console.error("Error in gemini function:", error);
    throw error;
  }
};

// ✅ Create directories and UUIDs
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

// ✅ Generate content and write to file
const send = async (req, res) => {
  try {
    const { prompt, uuid1 } = req.body;
    const filePath = path.join(__dirname, "write", `${uuid1}.html`);
    const answer = await gemini(prompt);

    await fsPromises.writeFile(filePath, answer);
    const fileContent = await fsPromises.readFile(filePath, "utf-8");

    res.status(200).type("html").send(fileContent);
  } catch (error) {
    console.error("Error in send function:", error);
    res.status(500).json({ error: "Failed to write and send the file." });
  }
};

// ✅ Append file content from one file to another
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
