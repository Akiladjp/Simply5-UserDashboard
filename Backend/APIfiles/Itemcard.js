import db from "../Config/DatabaseConfig.js";
import express from "express";
import { getImage } from "../AWS/get_images.js";
import multer from "multer";
import { uploadImage } from "../AWS/upload_image.js";
 
 
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
//import session from "express-session";
const itemcard = express.Router();

itemcard.get("/itemcard", async (req, res) => {
  try {
    const sql = "SELECT * FROM item WHERE rate >2.7 AND available ='AVAILABLE' ";

    db.query(sql, async (err, ans) => {
      if (err) return res.json({ Message: "Error inside server" });

      const result = [];

    
      const maxItems = Math.min(15, ans.length);
      for (var i = 0; i < maxItems; i++) {
        //console.log(ans[i].name, ",");

        const imageUrl = await getImage(ans[i].image_link);
        result.push({
          ...ans[i],
          image_url: imageUrl.url
        });
      }
    //  console.log("length",result)

      return res.json({ result });
    });
  } catch (error) {
    console.log(error);
    return res.json({ Message: "Error inside server" });
  }
});


itemcard.post("/itemcards", upload.single("image"), async (req, res) => {
  try {
    const filename = "item_bucket/" + req.file.originalname;

    console.log(filename);
    const sql = "UPDATE newItem SET image_link=? WHERE itemID= ? ";

    db.query(sql, [filename, 2], (error, result) => {
      if (error) {
        return res.json("error bn");
      }
      const upload_image = uploadImage(
        req.file.mimetype,
        filename,
        req.file.buffer
      );
      if (upload_image.message == "Successfully uploaded") {
        return res.json({ message: "success" });
      }
       else {
        const dlt = "DELETE from Item WHERE  itemID =?";
        db.query(dlt, [1], (error, result) => {
          if (result) {
            return res.json({ message: "item not added" });
          }
        }
      );
      }
    });
  } catch (error) {
    console.error("Error handling the image upload:", error);
    res.status(500).json({ message: "kkyugk server error" });
  }
});
export default itemcard;
