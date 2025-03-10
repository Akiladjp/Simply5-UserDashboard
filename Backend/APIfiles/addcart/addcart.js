import express from "express";
import db from "../../Config/DatabaseConfig.js";
import { getImage } from "../../AWS/get_images.js";
import multer from "multer";
import moment from "moment-timezone";
const add_cart = express.Router();

add_cart.get("/get_qaun_item", (req, res) => {
	const itemID = req.query.itemID;
	const mobileno = req.query.mobileno;
	const date = new Date().toISOString().split("T")[0];
	//console.log(itemID, mobileno);
	try {
		const sql = "SELECT * FROM add_cart WHERE mobileno=? AND  itemID=?  ";
		db.query(sql, [mobileno, itemID, date], async (err, result) => {
			if (err) {
				console.log(err);
				return res.json({ message: "error" });
			} else if (result.length == 0) {
				return res.json({ message: "data" });
			} else {
				console.log(result);
				return res.json({ result, message: "already" });
			}
		});
	} catch (err) {}
});

add_cart.get("/get_totalPrice/:mobileno", (req, res) => {
	var totalPrice = 0;
	const mobileno = req.params.mobileno;
	const date = new Date().toISOString().split("T")[0];
	// const today = new Date().toISOString().split("T")[0];

	try {
		const sql =
			"SELECT * FROM add_cart WHERE `mobileno` =? AND date=? AND state=? ";
		db.query(sql, [mobileno, date, "add"], (err, result) => {
			if (err) {
				console.log(err);
				return res.json({ message: "error" });
			} else if (result.length === 0) {
				return res.json({ message: "nodata" });
			} else {
				const quantities = result.map((item) => item.quantity);

				const sql_price = "SELECT `price` FROM item WHERE itemID = ?";

				let completedQueries = 0;
				let count = 0;
				for (let i = 0; i < quantities.length; i++) {
					db.query(sql_price, [result[i].itemID], (err, result_price) => {
						if (err) {
							console.log(err);
						} else {
							count += quantities[i];

							totalPrice += result_price[0].price * quantities[i];
						}
						completedQueries++;

						if (completedQueries === quantities.length) {
							console.log(count);
							return res.json({ totalPrice, count, message: "success" });
						}
					});
				}
			}
		});
	} catch (err) {
		console.log(err);
		return res.json({ message: "error" });
	}
});

add_cart.post("/add_cart", async (req, res) => {
	console.log("req", req.body.mobileno);
	console.log("req itemID", req.body.itemID);
	const date = new Date().toISOString().split("T")[0];
	const timeInColombo = moment()
		.tz("Asia/Colombo")
		.format("YYYY-MM-DD HH:mm:ss");
	console.log(timeInColombo);
	try {
		const sql1 = "SELECT * FROM add_cart WHERE mobileno=? AND itemID =?";

		db.query(
			sql1,
			[req.body.mobileno, req.body.itemID],
			async (err, result) => {
				if (err) {
					console.log("error in checking item in addcart", err);
					return res.json({ message: "error in checking item in addcart" });
				}
				// new data
				else if (result.length === 0) {
					console.log("case1");

					console.log(result);
					console.log("result length", result.length);
					console.log("this is new item to cart");
					const sql =
						"INSERT INTO add_cart (`mobileno`, `itemID`, `quantity`,`state`,`date`,`time`) VALUES (?,?,?,?,?,?)";

					const values = [
						req.body.mobileno,
						req.body.itemID,
						req.body.quantity,
						"add",
						date,
						timeInColombo,
					];

					db.query(sql, values, async (err, result) => {
						if (err) {
							console.log("Error while inserting new item:", err);
							return res.json({ message: "err" });
						} else {
							console.log(result);
							return res.json({ message: "result" });
						}
					});
				}
				// that item already in addCart
				else {
					console.log("this is already in cart");
					console.log("database quantity", result[0].quantity);
					if (result.quantity != req.body.quantity) {
						console.log("case2");

						const check_state_sql =
							"SELECT state FROM add_cart WHERE mobileno = ? AND itemID = ?";

						db.query(
							check_state_sql,
							[req.body.mobileno, req.body.itemID],
							(err, result) => {
								if (err) {
									console.log("error on checking state sql", err);
									return res.json({
										message: "error on checking state sql",
									});

								} 
								else {
									console.log(result);
									const check_state = result.map((item)=>(item.state))
									console.log("check_state",check_state);
									// console.log("in check state", result[0]["state"]);

									if (result[0]["state"] != "add") {
										console.log("case3");

										const check_state_sql =
											"SELECT state FROM add_cart WHERE mobileno = ? AND itemID = ?";
										// add_cart has more than one item relevant to the same itemID both placeOrder and add
										db.query(
											check_state_sql,
											[req.body.mobileno, req.body.itemID],
											(err, result) => {
												if (err) {
													console.log(err);
													return res.json({
														message: "error in nested check_state_sql",
													});
												} else {
													const state = result.map((item) => item.state);

													console.log(state);
													for (var i = 0; i < state.length; i++) {
														if (result[i]["state"] == "add") {
															console.log("case4");

															console.log("this this this this");
															const sql2 =
																"UPDATE add_cart SET quantity = ? WHERE mobileno = ? AND itemID = ?";
															console.log(
																"update value in already placeOrder",
																req.body.quantity
															);
															db.query(
																sql2,
																[
																	req.body.quantity,
																	req.body.mobileno,
																	req.body.itemID,
																],
																async (err, result) => {
																	if (err) {
																		console.log("error in updating quantity");
																		return res.json({
																			message: "update error",
																		});
																	} else {
																		console.log(
																			"quantity updated successfully"
																		);
																		return res.json({
																			message: "quantity update success",
																		});
																	}
																}
															);
															break;
														} else {
															if(i==state.length-1){

																console.log("case5");
																
																const sql =
																"INSERT INTO add_cart (`mobileno`, `itemID`, `quantity`,`state`,`date`,`time`) VALUES (?,?,?,?,?,?)";
																
																const values = [
																	req.body.mobileno,
																	req.body.itemID,
																	req.body.quantity,
																	"add",
																	date,
																	timeInColombo,
																];
																
																db.query(sql, values, async (err, result) => {
																	if (err) {
																		console.log("Insert error", err);
																		return res.json({
																			message: "err",
																		});
																	} else {
																		console.log(
																			"item added to cart successfully",
																			result
																		);
																		return res.json({
																			message: "result",
																		});
																	}
																});
															}
															
														}
													}
												}
											}
										);
									}
								}
							}
						);
					}
				}
			}
		);
	} catch (err) {
		console.log("server error", err);
		res.json({ message: "server error" });
	}
});

add_cart.get("/get_cartValues", async (req, res) => {
	const mobileno = req.query.mobileno;
	const date = new Date().toISOString().split("T")[0];
	try {
		const add_cart_item_id = [];
		const add_cart_item_quanity = [];
		const add_cart_item_time = [];
		const sqlID =
			"SELECT * FROM add_cart WHERE mobileno=? AND date=? AND state =? ";

		db.query(sqlID, [mobileno, date, "add"], async (err, result_id) => {
			if (err) {
				console.log(err);
				return res.json({ message: "Error in getting itemid from addcart" });
			}
			console.log(result_id);
			const result = [];

			for (let j = 0; j < result_id.length; j++) {
				add_cart_item_id.push(result_id[j]["itemID"]);
				add_cart_item_quanity.push(result_id[j]["quantity"]);
				add_cart_item_time.push(result_id[j]["time"]);
				const cartid = result_id[j]["itemID"];

				const sql = "SELECT * FROM item WHERE itemID = ?";
				const itemResults = await new Promise((resolve, reject) => {
					db.query(sql, [cartid], (err, ans) => {
						if (err) {
							reject(err);
						} else {
							resolve(ans);
						}
					});
				});

				const maxItems = Math.min(15, itemResults.length);
				for (let i = 0; i < maxItems; i++) {
					const imageUrl = await getImage(itemResults[i].image_link);

					result.push({
						...itemResults[i],

						image_url: imageUrl.url,
					});
				}
			}
			console.log(result, add_cart_item_time, "add_cart_item_quanity");
			return res.json({ result, add_cart_item_quanity, add_cart_item_time });
		});
	} catch (error) {
		console.log(error);
		return res.json({ message: "Error inside server" });
	}
});

add_cart.delete("/addcart/removeitem_from_cart", async (req, res) => {
	try {
		const sql = "DELETE FROM add_cart WHERE itemID = ? AND state =?";
		db.query(sql, [req.body.itemid,"add"], (err, result) => {
			if (err) {
				console.error("Error in delete query", err);
				return res.status(500).json({ message: "err" });
			} else {
				return res.json({ message: "success" });
			}
		});
	} catch (err) {
		console.log("Error in add cart:", err);
		return res.status(500).json({ message: "err" });
	}
});

add_cart.put("/update_quantity", (req, res) => {
	try {
		const sql =
			"UPDATE add_cart SET quantity = ? WHERE mobileno = ? AND itemID = ?";
		db.query(
			sql,
			[req.body.count, req.body.mobileno, req.body.itemID],
			(err, result) => {
				if (err) {
					console.log(err);
					return res.json({ message: "err" });
				} else {
					console.log("update succesfull");
					return res.json({ message: "success" });
				}
			}
		);
	} catch (err) {
		console.log("err", err);
	}
});

export default add_cart;
