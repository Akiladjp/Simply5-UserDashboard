import db from "../../Config/DatabaseConfig.js";
import express from "express";
import { getImage } from "../../AWS/get_images.js";
import multer from "multer";

const category = express.Router();

category.get("/category", async (req, res) => {
	const categoryParam = req.query.category;

	try {
		const sql = "SELECT * FROM item WHERE category =? ";

		db.query(sql, [categoryParam], async (err, ans) => {
			if (err) return res.json({ Message: "Error inside server" });

			const result = [];

			const maxItems = Math.min(15, ans.length);
			for (var i = 0; i < maxItems; i++) {
				const imageUrl = await getImage(ans[i].image_link);

				result.push({
					...ans[i],
					image_url: imageUrl,
				});
			}

			return res.json({ result });
		});
	} catch (error) {
		console.log(error);
		return res.json({ Message: "Error inside server" });
	}
});
export default category;
