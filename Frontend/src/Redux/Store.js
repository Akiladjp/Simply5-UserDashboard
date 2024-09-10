import { configureStore } from "@reduxjs/toolkit";
import buttonReducer from "../Redux/Slices/AddbuttonSlice.js"
import MenubuttonReducer from "../Redux/Slices/MenuButtonSlice.js"
import mainpageReducer from "../Redux/Slices/MainPageSilce.js"
import  categoryAppearanceReducer  from "./Slices/CategaryAppearnceSlice.js";
import itemIDReducer from "./Slices/ItemIdSlider.js"
import authReducer from "./Slices/AuthSlice.js"
import addCountReducer from "./Slices/AddbuttonCountSlice.js"
import quantityCountReducer from "./Slices/QuantityCountSlice.js"
import itemCountReducer from "./Slices/ItemCartCount.js"
export const store = configureStore({
  reducer: {
    addButton: buttonReducer,
    menuButton: MenubuttonReducer,
    categoryAppearance: categoryAppearanceReducer,
    mainpage:mainpageReducer,
    itemID:itemIDReducer,
    userinfo:authReducer,
    addCount:addCountReducer,
    quantityCount: quantityCountReducer,
    itemcount:itemCountReducer,
  },
});