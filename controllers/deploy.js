// const path=require("path")
// const fsPromises = require("fs").promises;
// const { v4: uuidv4 } = require("uuid");

// const deploy=async(req, res)=>{
//     try {
//         const uuid = uuidv4();
//         const {code}=req.params;

//         const deployDir = path.join(__dirname, "deploy");
//         await fsPromises.mkdir(deployDir, { recursive: true });

//         const filePath = path.join(__dirname, "./deploy", `${uuid}.html`);

//         await fsPromises.writeFile(filePath, code);

//         // const fileContent = await fsPromises.readFile(filePath, "utf-8");
//         // res.status(200).type("html").send(fileContent);
//         // await fsPromises.access(filePath);

//         // res.status(200).type("html").sendFile(filePath);

//         res.json({"uuid": uuid})

//     } catch (error) {
//         console.error("Error while deploying:", error);
//         res.status(404).json({ error: "File not found." });
//     }

// }

// module.exports=deploy

const path = require("path");
const fsPromises = require("fs").promises;
const { v4: uuidv4 } = require("uuid");

const deploy = async (req, res) => {
  try {
    const { code } = req.query;

    // Validate 'code'
    if (!code) {
      return res.status(400).json({ error: "Code content is required" });
    }

    const uuid = uuidv4();
    const deployDir = path.join(__dirname, "deploy");

    await fsPromises.mkdir(deployDir, { recursive: true });
    const filePath = path.join(deployDir, `${uuid}.html`);

    await fsPromises.writeFile(filePath, code); 

    res.json({ uuid });
  } catch (error) {
    console.error("Error while deploying:", error);
    res.status(500).json({ error: "Server error while deploying" });
  }
};

const getDeploy=async(req, res)=>{
    try {
        const { uuid } = req.params;

        const filePath = path.join(__dirname, "/deploy", `${uuid}.html`);

        await fsPromises.access(filePath);

        res.status(200).type("html").sendFile(filePath);
    } catch (error) {
        console.error("Error serving file:", error);
        res.status(404).json({ error: "File not found." });
    }
}

module.exports = {deploy, getDeploy};
