import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Rating from "../Components/rating/Rating";
import { useSelector } from "react-redux";
import { selectMobileno } from "../Redux/Slices/AuthSlice";
import axios from "axios";
import { legacy_createStore } from "@reduxjs/toolkit";
const API_URL = import.meta.env.VITE_API_URL;
function PreFeedback() {
  const navigate = useNavigate();
  const mobile_no = useSelector(selectMobileno);
  const [itemDetails, setItemDeails] = useState([]);
  console.log(mobile_no);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `${API_URL}/feedback_rating/${mobile_no}`
      );
      if (
        response.data &&
        response.data.result &&
        response.data.result.length > 0
      ) {
        // console.log(response.data.order_ID);
        setItemDeails(response.data.result); // Set the data if available
      } else {
        navigate("/");
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <div className="md:w-[60%] w-full h-auto m-auto mb-12">
        <h1 className="w-[90%] mx-auto font-semibold text-center md:text-4xl justify-center text-[16px] mt-8">
		Haven't Rated Us Yet? We'd Love to Hear From You!
        </h1>
        <div className="md:mt-8 w-[80%] h-auto flex md:flex-row md:gap-x-8 flex-col items-center justify-center flex-wrap ">
          {itemDetails && itemDetails.length !== 0 ? (
            itemDetails.map((item, index) => (
              <div key={index} className="gap-x-2 flex item-start">
                <Rating
                  order_ID={item.order_ID}
                  itemID={item.itemID}
                  name={item.name}
                  imageUrl={item.image_url}
                  rate={item.rate}
                  Pre_count={item.number_of_reviewer}
                />
              </div>
            ))
          ) : (
            <div>
              <span>No item found</span>
            </div>
          )}
        </div>

        <div className="pb-12">
          <Link to="/">
            <button className="px-6 py-1 bg-red-500 flex items-center justify-center m-auto top-20 relative bottom-0 text-white text-xl rounded-lg hover:bg-red-700">
              SKIP
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default PreFeedback;
