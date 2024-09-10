import express from "express";
import db from "../../Config/DatabaseConfig.js";
import { getImage } from "../../AWS/get_images.js";
import multer from "multer";

const billSection = express.Router();

billSection.get('/billSection/:mobileno', (req, res) => {
    
    const sql1 = "SELECT * FROM orders WHERE mobileNo=?";

    const orderId = null;

    const mobileno = req.params.mobileno;
    console.log("Mobile number is ", mobileno);

    db.query(sql1, [mobileno], (err, result)=> {
        if(err) {
            console.log({Message:"Error in billSection"});
        }
        else {
            console.log("Query", result);
            res.json(result);
        }
    })
})

export default billSection;
