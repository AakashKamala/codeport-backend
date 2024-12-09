const express=require("express")
const router=express.Router()
const {fileAppend, fileWrite}=require("../controllers/file")

router.route("/append/:uuid").get(fileAppend)
router.route("/write/:uuid").get(fileWrite)

module.exports=router