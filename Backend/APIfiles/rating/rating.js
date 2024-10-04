import { getImage } from "../../AWS/get_images.js";
import db from "../../Config/DatabaseConfig.js";

import express from "express";

const rating = express.Router();

rating.put("/rating_updateRate", (req, res) => {
	try {
		const id = req.body.id;
		const mobile_no = req.body.mobile_no;
		console.log("mobile_no", mobile_no);

		const rate = parseFloat(req.body.rating); // Ensure it's a float
		const roundedRate = parseFloat(rate.toFixed(2));

		const sql1 = "SELECT * FROM item WHERE `itemID`=?";
		db.query(sql1, [id], (err, dbResult) => {
			if (err) {
				console.error("Error in SQL SELECT:", err);
				return res.status(500).json({ message: "Error in SQL SELECT" });
			} else if (dbResult.length === 0) {
				return res.status(404).json({ message: "Item not found" });
			} else {
				if (roundedRate <= 10.0) {
					const sql2 =
						"UPDATE item SET `rate`=?, `number_of_reviewer` = `number_of_reviewer` + 1 WHERE `itemID`=?";
					db.query(sql2, [roundedRate, id], (err, result) => {
						if (err) {
							console.error("Error in SQL UPDATE:", err);
							return res.status(500).json({ message: "Error in SQL UPDATE" });
						}

						console.log("SQL UPDATE Result:", result);
						if (result.affectedRows === 0) {
							return res.status(400).json({ message: "No rows updated" });
						}
						const feedback_state_update_sql =
							"UPDATE add_cart SET `feedback_state`=? WHERE `itemID`=? AND mobileno =?";
						db.query(
							feedback_state_update_sql,
							["ADDED", id, mobile_no],
							(err, result) => {
								if (err) {
									console.log(err);
									return;
								}
							}
						);
						return res.json({ message: "Rating added successfully" });
					});
				} else {
					return res.status(400).json({ message: "rating above 10" });
				}
			}
		});
	} catch (err) {
		console.error("Unexpected error:", err);
		return res.status(500).json({ message: "An unexpected error occurred" });
	}
});

rating.get("/rating_getItem_details/:order_id", async (req, res) => {
	try {
		const order_id = req.params.order_id;

		const sql = "SELECT `itemID` FROM contains WHERE orderID = ? ";
		db.query(sql, [order_id], async (err, idList) => {
			if (err) {
				console.log("Error in SQL", err);
				return res.json({ message: "Error in SQL" });
			} else {
				const itemIDs = idList.map((row) => row.itemID);
				const finalresult = [];

				try {
					await Promise.all(
						itemIDs.map((itemID) => {
							return new Promise((resolve, reject) => {
								const check_feedback_state_sql =
									"SELECT feedback_state FROM add_cart WHERE itemID=?";
								db.query(check_feedback_state_sql, [itemID], (err, result) => {
									if (err) {
										console.log("Error in checking feedback state", err);
										reject(err);
										return;
									}

									// Check if any feedback_state is "ADDED"
									const isAdded = result.some(
										(row) => row.feedback_state === "ADDED"
									);

									if (isAdded) {
										console.log(`Feedback already added for itemID: ${itemID}`);
										resolve();
									} else {
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

												for (
													var i = 0;
													i < itemDetailes_Image_link.length;
													i++
												) {
													const imageUrl = await getImage(
														itemDetailes_Image_link[i]
													);
													if (imageUrl) {
														finalresult.push({
															itemID: itemDetails[0].itemID,
															name: itemDetails[0].name,
															rate: itemDetails[0].rate,
															number_of_reviewer:
																itemDetails[0].number_of_reviewer,
															imageUrl,
														});
													} else {
														return res.json({
															message: "Error in getting image",
														});
													}
												}

												resolve();
											}
										});
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

rating.get("/feedback_rating/:mobileNo", (req, res) => {
	const mobileno = req.params.mobileNo;

	// SQL query to get orderID by mobileNO
	const sql_orderid = "SELECT `orderID` FROM `orders` WHERE mobileNO = ?";
	db.query(sql_orderid, [mobileno], (err, result) => {
		if (err) {
			console.log("Error in SQL:", err);
			return res.json({ message: "Error in SQL" });
		}

		if (result.length === 0) {
			return res.json({ message: "No order found for this mobile number" });
		}

		const orderIDs = result.map((order) => order.orderID);

		// Initialize a Set to hold unique itemIDs across all orders
		const uniqueIDs = new Set();
		const finalresult = [];

		// Use Promise.all to handle all the asynchronous tasks
		Promise.all(
			orderIDs.map((orderID) => {
				return new Promise((resolve, reject) => {
					// Get itemIDs for the current orderID
					const sql_itemID = "SELECT itemID FROM contains WHERE orderID = ?";
					db.query(sql_itemID, [orderID], (err, idList) => {
						if (err) {
							console.log("Error in SQL:", err);
							return reject(err);
						}

						if (idList.length === 0) {
							return resolve(); // No items, continue to the next order
						}

						const itemIDs = idList.map((row) => row.itemID);

						// Check feedback state and fetch item details if feedback is not "ADDED"
						Promise.all(
							itemIDs.map((itemID) => {
								return new Promise((resolveItem, rejectItem) => {
									// Check feedback_state in add_cart
									const check_feedback_state_sql =
										"SELECT feedback_state FROM add_cart WHERE itemID = ? AND mobileno=?";
									db.query(
										check_feedback_state_sql,
										[itemID, mobileno],
										(err, result) => {
											if (err) {
												console.log("Error in checking feedback state", err);
												return rejectItem(err);
											}
											console.log(result);
											// Check if any feedback_state is "ADDED"
											const isAdded = result.some(
												(row) => row.feedback_state === "ADDED"
											);
											console.log(isAdded)

											if (isAdded) {
												console.log(
													`Feedback already added for itemID: ${itemID}`
												);
												resolveItem(); // Skip item if feedback is "ADDED"
											} else {
												// Fetch item details if feedback_state is not "ADDED"
												const sql_itemDetails =
													"SELECT itemID, name, rate, number_of_reviewer, image_link FROM item WHERE itemID = ?";
												db.query(
													sql_itemDetails,
													[itemID],
													async (err, itemDetails) => {
														if (err) {
															console.log("Error in SQL:", err);
															return rejectItem(err);
														}

														if (itemDetails.length > 0) {
															const itemDetail = itemDetails[0];
															const imageUrl = await getImage(
																itemDetail.image_link
															);

															if (imageUrl) {
																finalresult.push({
																	itemID: itemDetail.itemID,
																	name: itemDetail.name,
																	rate: itemDetail.rate,
																	number_of_reviewer:
																		itemDetail.number_of_reviewer,
																	imageUrl,
																});
															} else {
																return res.json({
																	message: "Error in fetching image URL",
																});
															}
														}
														resolveItem();
													}
												);
											}
										}
									);
								});
							})
						).then(() => resolve()); // Resolve the promise for the current orderID
					});
				});
			})
		)
			.then(() => {
				// Once all promises are resolved, send the final result
				// console.log(finalresult);
				return res.json({ result: finalresult });
			})
			.catch((err) => {
				console.log("Error in promise execution:", err);
				return res.json({ message: "Error in retrieving item details" });
			});
	});
});

export default rating;
