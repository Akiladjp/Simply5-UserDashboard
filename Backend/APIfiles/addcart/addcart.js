import express from "express";
import db from "../../Config/DatabaseConfig.js";
import { getImage } from "../../AWS/get_images.js";
import multer from "multer";

const add_cart = express.Router();

add_cart.get("/get_qaun_item", (req, res) => {
  const itemID = req.query.itemID;
  const mobileno = req.query.mobileno;
  const date = new Date().toISOString().split("T")[0];
  //console.log(itemID, mobileno);
  try {
    const sql =
      "SELECT * FROM add_cart WHERE mobileno=? AND  itemID=? AND date=?";
    db.query(sql, [mobileno, itemID, date], async (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "error" });
      } else if (result.length == 0) {
        return res.json({ message: "nodata" });
      } else {
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
    const sql = "SELECT * FROM add_cart WHERE `mobileno` =? AND date=?";
    db.query(sql, [mobileno, date], (err, result) => {
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

  try {
    const sql1 = "SELECT * FROM add_cart WHERE mobileno=? AND itemID =?";

    db.query(
      sql1,
      [req.body.mobileno, req.body.itemID],
      async (err, result) => {
        if (err) {
          console.log("error in checking item in addcart", err);
        } else if (result.length === 0) {
          console.log("result length", result.length);
          console.log("this is new item to cart");
          const sql =
            "INSERT INTO add_cart (`mobileno`, `itemID`, `quantity`,`date`) VALUES (?,?,?,?)";

          const values = [
            req.body.mobileno,
            req.body.itemID,
            req.body.quantity,
            date,
          ];

          db.query(sql, values, async (err, result) => {
            if (err) {
              return res.json({ message: "err" });
            } else {
              return res.json({ message: "err" });
            }
          });
        } else {
          console.log("this is already in  cart");
          console.log("databaase quantity", result[0].quantity);
          if (result.quantity != req.body.quantity) {
            const sql2 =
              "UPDATE add_cart SET quantity = ? WHERE mobileno = ? AND itemID = ?";

            console.log("update value", req.body.quantity);
            db.query(
              sql2,
              [req.body.quantity, req.body.mobileno, req.body.itemID],
              async (err, result) => {
                if (err) {
                  console.log("error in updating quantity");
                } else {
                  console.log("quanity update successfully");
                }
              }
            );
          }
        }
      }
    );
  } catch (err) {}
});

add_cart.get("/get_cartValues", async (req, res) => {
  const mobileno = req.query.mobileno;
  const date = new Date().toISOString().split("T")[0];
  try {
    const add_cart_item_id = [];
    const add_cart_item_quanity = [];
    const sqlID = "SELECT * FROM add_cart WHERE mobileno=? AND date=?";

    db.query(sqlID, [mobileno, date], async (err, result_id) => {
      if (err) {
        return res.json({ message: "Error in getting itemid from addcart" });
      }
      const result = [];

      for (let j = 0; j < result_id.length; j++) {
        add_cart_item_id.push(result_id[j]["itemID"]);
        add_cart_item_quanity.push(result_id[j]["quantity"]);
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
      //console.log(result, add_cart_item_quanity);
      return res.json({ result, add_cart_item_quanity });
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: "Error inside server" });
  }
});

add_cart.delete("/addcart/removeitem_from_cart", async (req, res) => {
  try {
    const sql = "DELETE FROM add_cart WHERE itemID = ?";
    db.query(sql, [req.body.itemid], (err, result) => {
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
