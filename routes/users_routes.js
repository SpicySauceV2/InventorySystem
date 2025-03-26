const express = require("express")
const router = express.Router()








router.get("/inventory",(req,res) => {
    console.log("store")
    res.render("storage_page.ejs")
})


router.get("/hub",(req,res) => {
    console.log("here")
    res.render("hub.ejs")
})

router.get("/warehouse_resupply",(req,res) => {
    console.log("here")
    res.render("warehouse_resuplly_request.ejs")
})


router.get("/login",(req,res) => {
    console.log("here")
    res.render("index.html")
})

router.get("/financial",(req,res) =>{
    res.render("financial_report page.ejs")
})









module.exports = router