import express from "express";
import mysql from "mysql";
import cors from "cors";
import session from "express-session";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import userlogin from "../Backend/APIfiles/userlogin.js";
import itemcard from "../Backend/APIfiles/Itemcard.js";
import category from "../Backend/APIfiles/category/category.js";
import popupitems from "./APIfiles/popItems/popitems.js";
import add_cart from "./APIfiles/addcart/addcart.js";
import order_button from "./APIfiles/orderButton/orderButton.js";
import subcategory from "./APIfiles/subCategory/subCategory.js"
import rating from "./APIfiles/rating/rating.js"
import billSection from "./APIfiles/billSection/billSection.js";
const app = express();
const PORT = process.env.PORT || 8082;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5176", "http://192.168.8.100:5176"], // Add your IP here
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

app.use("/", userlogin);
app.use("/", itemcard);
app.use("/", category);
app.use("/", popupitems);
app.use("/", add_cart);
app.use("/", order_button);
app.use("/", subcategory);
app.use('/',rating);
app.use('/', billSection);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ,${PORT}`);
});

export { app };