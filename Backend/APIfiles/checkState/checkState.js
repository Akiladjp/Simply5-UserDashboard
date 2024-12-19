import db from "../../Config/DatabaseConfig.js";
import express from "express";

const check_state = express.Router();

check_state.get("/check_state/:mobile_no", (req, res) => {
	const mobile_no = req.params.mobile_no;
	// console.log("mobile_no", mobile_no);
	try {
		const sql = "SELECT * FROM orders WHERE `mobileNO`=?";
		db.query(sql, [mobile_no], (err, result) => {
			if (err) {
				console.log(err);
				return;
			}
			const itemList = result.map((item) => ({
				status: item.status,
				orderID: item.orderID,
			}));
			const newStatus = itemList.map(item => item.orderID + item.status);
			
			const updatedResult = result.map((item) => {
				item.status = item.orderID + item.status;
				return item;
			});
			
			
			res.json({ result: updatedResult });
		});
	} catch (err) {
		console.log(err);
	}
});

export default check_state;
