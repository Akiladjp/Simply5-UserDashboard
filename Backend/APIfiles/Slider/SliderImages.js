import { getImage } from "../../AWS/get_images.js";
import db from "../../Config/DatabaseConfig.js";

import express from "express";

const sliderUpload = express.Router();


sliderUpload.get("/slider", async (req, res) => {
    try {
      const sql = "SELECT * FROM offers";
      db.query(sql, async (err, ans) => {
        if (err) return res.json({ Message: "Error in offerBanner", err });
  
        const offerBanner = [];
        const maxOffers = Math.min(15, ans.length);
  
        for (let i = 0; i < maxOffers; i++) {
          const imageUrl = await getImage(ans[i].image_link);
          offerBanner.push({
            ...ans[i],
            image_url: imageUrl,
          });
        }
        console.log(offerBanner);
  
        return res.json({ offerBanner });
      });
    } catch (error) {
      console.log("Error in get offer banners", error);
      return res.json({ Message: "Error inside server" });
    }
  });


export default sliderUpload;