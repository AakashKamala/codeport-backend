const express=require("express")
const cors=require("cors")
require("dotenv").config()
const path=require("path")

const socketIo=require("socket.io")
const http=require("http")

const app=express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const server=http.createServer(app)
const answer=new Map()

const io=socketIo(server,{
    cors:{
        origin: true
    }
})

io.on("connection",(socket)=>{
    console.log("a new socket connection", socket.id)

    socket.on("ques", (roomNo)=>{
        socket.join(roomNo)
        io.to(roomNo).emit("welcome", {"message":`${socket.id} , joined the room`, "answer":answer.get(roomNo)})
    })

    socket.on("sol", (text, roomNo)=>{
        io.to(roomNo).emit("soln", {"message":text})
        answer.set(roomNo, text)
    })
})

const codeRoutes=require("./routes/code")
const fileRoutes=require("./routes/file")
const deployRoutes=require("./routes/deploy")
// const deploy = require("./controllers/deploy");
// app.get("/deploy", deploy);

app.use("/code", codeRoutes)
app.use("/view", fileRoutes)
app.use("/", deployRoutes)

// app.use("/deploy", express.static(path.join(__dirname, "deploy")));

app.get("/",(req, res)=>{
    res.json({"message": "alive"})
})

const PORT=process.env.PORT||5001

server.listen(PORT,()=>{
    console.log(`server is listening on PORT: ${PORT}`)
})