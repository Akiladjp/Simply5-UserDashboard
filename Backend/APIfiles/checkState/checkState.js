import db from "../../Config/DatabaseConfig.js";
import express from "express";

const check_state = express.Router();

check_state.get("/check_state/:mobile_no", (req, res) => {
	const mobile_no = req.params.mobile_no;
	console.log("mobile_no", mobile_no);
	try {
		const sql = "SELECT * FROM orders WHERE `mobileNO`=? AND status !='hidden'";
		db.query(sql, [mobile_no], (err, result) => {
			if (err) {
				console.log(err);
				return;
			}
			console.log("result", result);
      res.json({result:result})
		});
	} catch (err) {
		console.log(err);
	}
});

export default check_state;
