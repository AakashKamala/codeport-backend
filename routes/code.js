const express=require("express")
const router=express.Router()
const {createFiles, send, accept}=require("../controllers/code")

router.route("/create").post(createFiles)
router.route("/send").post(send)
router.route("/accept").post(accept)

module.exports=router