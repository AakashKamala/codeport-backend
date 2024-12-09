const path = require("path");
const fsPromises = require("fs").promises;

const fileWrite= async (req, res) => {
    try {
        const { uuid } = req.params;

        const filePath = path.join(__dirname, "/write", `${uuid}.html`);

        await fsPromises.access(filePath);

        res.status(200).type("html").sendFile(filePath);
    } catch (error) {
        console.error("Error serving file:", error);
        res.status(404).json({ error: "File not found." });
    }
};

const fileAppend= async (req, res) => {
    try {
        const { uuid } = req.params;

        const filePath = path.join(__dirname, "/append", `${uuid}.html`);

        await fsPromises.access(filePath);

        res.status(200).type("html").sendFile(filePath);
    } catch (error) {
        console.error("Error serving file:", error);
        res.status(404).json({ error: "File not found." });
    }
};

module.exports = {fileWrite, fileAppend}
