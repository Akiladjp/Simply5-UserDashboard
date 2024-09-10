import { useEffect, useState } from "react";
import { LgBtn } from "../Components/rating/LgBtn";
import Rating from "../Components/rating/Rating";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectMobileno } from "../Redux/Slices/AuthSlice";


const RatingPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const mobile_no = useSelector(selectMobileno);
  const order_id = 2;
  //console.log(" in rating page:", mobile_no);

  const [itemDetails, setItemDeails] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
         ` ${API_URL}/rating_getItem_details/${order_id}`
        );

        if (response.status === 200) {
          
          setItemDeails(response.data.result);
          
        } else {
          console.log("Error: Unexpected response status", response.status);
        }
      } catch (err) {
        console.log("Error in rating page when axios calling", err);
      }
    };

    fetchData();
  }, []);


  return (
    <div>
      {itemDetails.map((item, index) => (
        <div key={index}>
          <Rating itemID = {item.itemID} name={item.name} imageUrl={item.imageUrl} rate={item.rate} Pre_count={item.number_of_reviewer}/>
        </div>
      ))}

      <LgBtn />
    </div>
  );
};

export default RatingPage;