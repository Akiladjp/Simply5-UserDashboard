import {  useLocation } from "react-router-dom";
import ItemCart from "../../Components/ItemCart";
import ScrollToTop from "../../Components/ScrollTop";

import { useDispatch, useSelector } from "react-redux";
import { setMainpageState } from "../../Redux/Slices/MainPageSilce";
import { useEffect, useState } from "react";
import axios from "axios";
import PopOrder from "../../Components/PopOrder";
import { selectButtonState } from "../../Redux/Slices/AddbuttonSlice";

export default function Category() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [Mealitems, setMealitems] = useState([]);

  const buttonState = useSelector(selectButtonState);
  const location = useLocation();
  const { category } = location.state || {};
  console.log(category);
  const dispatch = useDispatch();

  const changeMainpagestate=()=>{
    dispatch(setMainpageState(false))
  }
  useEffect(()=>{
    changeMainpagestate()
  },[])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/category?category=${category}`);

        const items = res.data.result || [];
        //const imageLinks = items.map(item => item.image_link || "");

        setMealitems(items);
        // setLinks(imageLinks);
        // console.log(links[0]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);
  return (
  
    <div className="w-full   top-[50px]  h-auto pb-2">
      <ScrollToTop/>
    
      <div className={`${buttonState?' blur-md  h-screen overflow-hidden items-center   py-2  flex flex-wrap  justify-center gap-8 mt-4':'flex flex-wrap items-center justify-center gap-8 mt-4'}`}>
      {Mealitems.length > 0 &&
          Mealitems.map((item, index) => (
            <>
            <div   key={item.itemID} >

              <ItemCart
                key={item.itemID}
                itemID={item.itemID}
                buttonTitle="ADD"
                name={item.name}
                time={item.prepare_time}
                rating={item.rate}
                price={`Rs ,${item.price}`}
                image={item.image_url}
                />
                </div>
            </>
          ))}


      </div><div
        className={`${
          buttonState
            ? " absolute m-auto z-10 flex justify-center w-full overflow-hidden   items-center top-0 bottom-0"
            : " hidden"
        } `}
      >
      <PopOrder/>
        
      </div>
    </div>
  );
}
