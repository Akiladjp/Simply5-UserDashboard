import db from "../../Config/DatabaseConfig.js";
import express from "express";
import { getImage } from "../../AWS/get_images.js";
import multer from "multer";

const popupitems = express.Router();

popupitems.get("/getpopitems",async(req,res)=>{
  const itemid = req.query.itemid;
 try{
  const sql = "SELECT * FROM item WHERE itemID=? "

  db.query(sql,[itemid],async(err,ans)=>{

    const popItem=[];
    if(err){
      return res.json({message:"error:",err})
    }
    else{
      if(ans.length>0){
        const imageURl= await getImage(ans[0].image_link);
        popItem.push({
          ...ans[0],
          image_url: imageURl.url,
        });
      }
    }
    return res.json({popItem})
  })
 }catch(err){

 }
})

export default popupitems