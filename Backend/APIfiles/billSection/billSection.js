import express from "express";
import db from "../../Config/DatabaseConfig.js";
import { getImage } from "../../AWS/get_images.js";
import multer from "multer";

const billSection = express.Router();

billSection.get("/billSection/:mobileno", (req, res) => {
	const mobileno = req.params.mobileno;
console.log(mobileno);
	const sql1 = `
    SELECT 
      i.name, 
      o.orderID,
      o.status,
      o.time,
      SUM(c.quantity) AS totalQuantity, 
      i.price, 
      (SUM(c.quantity) * i.price) AS totalPrice,
      (SELECT SUM(c.quantity)
       FROM orders o
       JOIN contains c ON o.orderID = c.orderID
       WHERE o.mobileNo = ?) AS finalQuantity
    FROM 
      orders o
    JOIN 
      contains c ON o.orderID = c.orderID
    JOIN 
      item i ON c.itemID = i.itemID
    WHERE 
      o.mobileNo = ? AND (o.status ="delivered" OR o.status="paid" OR o.status="accept")
    GROUP BY 
      i.name, i.price;
  `;

	db.query(sql1, [mobileno, mobileno], (err, result) => {
		if (err) {
			console.log({ Message: "Error in billSection" });
			return res.status(500).json({ message: "Error in billSection" });
		} else {
			if (result.length > 0) {
				console.log(result);
				return res.json(result);
			} else {
				console.log("No orders found for this mobile number.");
				return res
					.status(404)
					.json({ message: "No orders found for this mobile number." });
			}
		}
	});
});

export default billSection;
