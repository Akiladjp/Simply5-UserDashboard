import db from "../../Config/DatabaseConfig.js";
import express from "express";

const service = express.Router();

service.post("/add_service/:empID", (req, res) => {
	const comment = req.body["message"];
  console.log("commen :",comment)
	const empID = req.params.empID;
	console.log(empID);
	const today = new Date();
	const date = today.toISOString().split("T")[0];
	console.log(date); // Outputs: "YYYY-MM-DD"
	try {
		const sql = "INSERT INTO service (empID,date,comment) VALUES (?,?,?)  ";
    db.query(sql,[empID,date,comment],(err,result)=>{
      if(err){
        return res.json({message:"Error in calling sql to database"})
      }else{
       return res.json({message:"SUCESSFULLY"})
      }
    })
	} catch (error) {
		console.log("error in server API", error);
	}
});

export default service;
