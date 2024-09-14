import bcrypt from "bcrypt";
import db from "../Config/DatabaseConfig.js";
import express from "express";
//import session from "express-session";
const userlogin = express.Router();

userlogin.post("/userlogin", (req, res) => {
    const phoneNo = req.body.phoneNo;
   // console.log("phoneNo",req);

    const checkSql = "SELECT * FROM user WHERE phoneNo = ?";
    db.query(checkSql, [phoneNo], (err, result) => {
      if (err) {console.log(err)
        return res.json(err);
      }
      if (result.length > 0) {
        return res.json({message:"already",result:result})
       
      } 
      else {
        const insertSql = "INSERT INTO user(`name`,`phoneNo`) VALUES(?,?)";

        const values = [req.body.name, req.body.phoneNo];

        db.query(insertSql, values, (err, result) => {
          if (err) {
            console.log(err)

            return res.json(err);
          }
          console.log(result)

          return res.json(result);
        });
      }
    });
  });
  
  userlogin.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status: "Success"});
  })
  


export default userlogin;
