import { getImage } from "../../AWS/get_images.js";
import db from "../../Config/DatabaseConfig.js";

import express from "express";

const rating = express.Router();

rating.get("/rating_getItem_details/:order_id", async (req, res) => {
	try {
		const order_id = req.params.order_id;

		const sql = "SELECT itemID FROM contains WHERE orderID = ?";
		db.query(sql, [order_id], async (err, idList) => {
			if (err) {
				console.log("Error in SQL");
				return res.json({ message: "Error in SQL" });
			} else {
				const itemIDs = idList.map((row) => row.itemID);
				const finalresult = [];

				try {
					await Promise.all(
						itemIDs.map((itemID) => {
							return new Promise((resolve, reject) => {
								const sql =
									"SELECT itemID, name, rate, number_of_reviewer, image_link FROM item WHERE itemID = ?";
								db.query(sql, [itemID], async (err, itemDetails) => {
									if (err) {
										console.log(err);
										reject(err);
									} else {
										const itemDetailes_Image_link = itemDetails.map(
											(item) => item.image_link
										);

										for (var i = 0; i < itemDetailes_Image_link.length; i++) {
											const imageUrl = await getImage(
												itemDetailes_Image_link[i]
											);
											if (imageUrl) {
												finalresult.push({
													itemID: itemDetails[0].itemID,
													name: itemDetails[0].name,
													rate: itemDetails[0].rate,
													number_of_reviewer: itemDetails[0].number_of_reviewer,
													imageUrl,
												});
											} else {
												return res.json({ message: "error in getting image" });
											}
										}

										resolve();
									}
								});
							});
						})
					);

					// Send the final result after all queries are completed
					return res.json({ result: finalresult });
				} catch (error) {
					console.log("Error in Promise.all", error);
					return res.json({ message: "Error in processing data" });
				}
			}
		});
	} catch (err) {
		console.log("Error from backend", err);
	}
});

rating.put("/rating_updateRate", (req, res) => {
	try {
		const id = req.body.id;
		const rate = parseFloat(req.body.rating); // Ensure it's a float
		const roundedRate = parseFloat(rate.toFixed(2));

		
		console.log('Received ID:', id, 'Received Rating:', rate, roundedRate);

		const sql1 = "SELECT * FROM item WHERE `itemID`=?";
		db.query(sql1, [id], (err, dbResult) => {
			if (err) {
				console.error("Error in SQL SELECT:", err);
				return res.status(500).json({ message: "Error in SQL SELECT" });
			} else if (dbResult.length === 0) {
			
				return res.status(404).json({ message: "Item not found" });
			} else {
			
				if(roundedRate<=10.0){

					const sql2 = "UPDATE item SET `rate`=?, `number_of_reviewer` = `number_of_reviewer` + 1 WHERE `itemID`=?";
					db.query(sql2, [roundedRate, id], (err, result) => {
						if (err) {
							console.error("Error in SQL UPDATE:", err);
							return res.status(500).json({ message: "Error in SQL UPDATE" });
						}
						
						console.log('SQL UPDATE Result:', result);
						if (result.affectedRows === 0) {
							
							return res.status(400).json({ message: "No rows updated" });
						}
						
						return res.json({ message: "Rating added successfully" });
					});
				}else{
					return res.status(400).json({ message: "rating above 10" });
				}
			}
		});
	} catch (err) {
		console.error("Unexpected error:", err);
		return res.status(500).json({ message: "An unexpected error occurred" });
	}
});



export default rating;
