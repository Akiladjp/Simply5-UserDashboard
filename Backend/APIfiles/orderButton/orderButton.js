import express from "express";
import db from "../../Config/DatabaseConfig.js";

const order_button = express.Router();

order_button.post("/create_order/:mobileno", (req, res) => {
	const mobileno = req.params.mobileno;
	const { tableno, status, total, time, date, items } = req.body;

	// First SQL query to insert the order
	const sql =
		"INSERT INTO orders(`mobileNo`, `tableNo`, `status`, `total`, `time`, `date`) VALUES (?, ?, ?, ?, ?, ?)";
	const values = [mobileno, tableno, status, total, time, date];

	db.query(sql, values, (err, result) => {
		if (err) {
			console.error("Database error:", err);
			return res
				.status(500)
				.json({ message: "Error creating order", error: err.message });
		}

		const orderId = result.insertId;

		// Prepare second query values to insert items with correct orderId
		const sql2 =
			"INSERT INTO contains(`orderID`, `itemID`, `quantity`) VALUES ?";
		const values2 = items.map((item) => [orderId, item.itemID, item.quantity]);

		db.query(sql2, [values2], (err, result) => {
			if (err) {
				console.error("Database error:", err);
				return res
					.status(500)
					.json({ message: "Error adding items to order", error: err.message });
			}
			console.log(result);
			// Third query to update `add_cart` table with state
			const sql3 =
				"UPDATE `add_cart` SET `state` = 'placeOrder' WHERE `mobileno` = ? AND `itemID` = ?";

			// Iteratively update each item in add_cart
			let errorOccurred = false;
			items.forEach((item, index) => {
				db.query(sql3, [mobileno, item.itemID], (err) => {
					if (err && !errorOccurred) {
						errorOccurred = true;
						console.error("Database error:", err);
						return res
							.status(500)
							.json({
								message: "Error updating cart items",
								error: err.message,
							});
					}
					// Send response only after all updates are done
					if (index === items.length - 1 && !errorOccurred) {
						return res
							.status(201)
							.json({ message: "Order created successfully", orderId });
					}
				});
			});
		});
	});
});

order_button.delete("/delete_cartValues/:mobileno", (req, res) => {
	const mobileno = req.params.mobileno;

	const sql = "DELETE FROM add_cart WHERE mobileno = ?";

	db.query(sql, [mobileno], (err, result) => {
		if (err) {
			console.error("Database error:", err);
			return res
				.status(500)
				.json({ message: "Error deleting item", error: err.message });
		}
		if (result.affectedRows === 0) {
			return res
				.status(404)
				.json({ message: "No items found for this mobile number" });
		}
		return res.json({ message: "Deleted successfully" });
	});
});

export default order_button;
