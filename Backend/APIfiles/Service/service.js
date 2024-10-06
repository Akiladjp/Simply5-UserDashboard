import db from "../../Config/DatabaseConfig.js";
import express from "express";

const service = express.Router();

service.post("/add_service/:empID", (req, res) => {
	const comment = req.body["message"];
	const empID = req.params.empID;
	console.log(empID);
	const today = new Date();
	const date = today.toISOString().split("T")[0];
	console.log(date); // Outputs: "YYYY-MM-DD"
	try {
		const sql = "INSERT INTO service (empID,date,comment) VALUES (?,?,?)  ";
		db.query(sql, [empID, date, comment], (err, result) => {
			if (err) {
				return res.json({ message: "Error in calling sql to database" });
			} else {
				return res.json({ message: "SUCESSFULLY" });
			}
		});
	} catch (error) {
		console.log("error in server API", error);
	}
});
service.get("/get_waiterID/:order_id", (req, res) => {
	const orderID = req.params.order_id;
	try{
const sql ="SELECT waiterID FROM orders WHERE `orderID`=?" 
db.query(sql,[orderID],(err,result)=>{
	if(err){
		console.log("Error in sql",err)
		return
	}
	if(result.length>0){
		return res.json({waiterID:result[0]["waiterID"]})
	}
})
	}
	catch(err){
		console.log("serve error")
	}
});

export default service;
