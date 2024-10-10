import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Rating from "../Components/rating/Rating";
import { useSelector } from "react-redux";
import { selectMobileno } from "../Redux/Slices/AuthSlice";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
function PreFeedback() {
	const navigate= useNavigate()
	const mobile_no = useSelector(selectMobileno);
	const [itemDetails, setItemDeails] = useState([]);
	console.log(mobile_no);

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.get(
				`${API_URL}/feedback_rating/${mobile_no}`
			);
			if (response.data && response.data.result && response.data.result.length > 0) {
          // console.log(response.data.order_ID);
          setItemDeails(response.data.result);  // Set the data if available
        }
			else{
				navigate("/")
			}
		};
		fetchData();
	}, []);
	return (
		<>
			<div className="w-[60%]  h-auto m-auto ">
				<h1 className="w-full text-center md:text-4xl justify-center text-[17px]  mt-8">Give Your Feedback about your last experience</h1>
				<div className="md:mt-8 w-full h-auto flex md:flex-row  md:gap-x-8 flex-col items-center justify-center flex-wrap">
				{
  itemDetails && itemDetails.length !== 0 ? (
    itemDetails.map((item, index) => (
      <div key={index} className="gap-x-2">
        <Rating
				order_ID={item.order_ID}
          itemID={item.itemID}
          name={item.name}
          imageUrl={item.imageUrl}
          rate={item.rate}
          Pre_count={item.number_of_reviewer}
        />
      </div>
    ))
  ) : (
    <div>
      <span>No item found</span>
    </div>
  )
}

				</div>
			
				<Link
					to="/"
					className="w-40 h-16 px-4 py-2 bg-orange-500 flex items-center justify-center m-auto top-20 relative bottom-0 text-white text-xl rounded-lg hover:bg-orange-600">
					SKIP
				</Link>
			</div>
		
		</>
	);
}

export default PreFeedback;
