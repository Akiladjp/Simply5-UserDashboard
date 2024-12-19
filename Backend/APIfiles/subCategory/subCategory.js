import db from "../../Config/DatabaseConfig.js";
import express from "express";
import { getImage } from "../../AWS/get_images.js";

const subcategory = express.Router();

subcategory.get("/subcategory", async (req, res) => {
	try {

		const sql =
			"SELECT DISTINCT `sub_category`,`image_link`, MAX(`rate`) AS max_rate FROM item GROUP BY `sub_category`";


		db.query(sql, async (error, result) => {
			if (error) {
				console.log("error in sql", error);
			} else {
				let subCategories = [];

       
				for (let i = 0; i < result.length; i++) {
					const imageUrl = await getImage(result[i].image_link);
					

					subCategories.push({
						name: result[i]["sub_category"],
						image_url: imageUrl.url,
					});
				}

				return res.json({ subCategories });
			}
		});
	} catch (err) {
		console.log("error in api", err);
	}
});

const category = express.Router();

subcategory.get("/subcategoryitems", async (req, res) => {

	
  const categoryParam = req.query.category;

  try {
    const sql = "SELECT * FROM item WHERE sub_category =? AND available ='AVAILABLE' ";

    db.query(sql,[categoryParam], async (err, ans) => {
      if (err) return res.json({ Message: "Error inside server" });

      const result = [];

      const maxItems = Math.min(15, ans.length);
      for (var i = 0; i < maxItems; i++) {
        console.log(ans[i].name, ",");

        const imageUrl = await getImage(ans[i].image_link);

        result.push({
          ...ans[i],
          image_url: imageUrl.url,
        });
      }
      console.log("length", result);

      return res.json({ result });
    });
  } catch (error) {
    console.log(error);
    return res.json({ Message: "Error inside server" });
  }
});
export default subcategory;
