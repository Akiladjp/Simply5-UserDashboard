import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Rating from "../Components/rating/Rating";
import { useSelector } from "react-redux";
import { selectMobileno } from "../Redux/Slices/AuthSlice";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
function PreFeedback() {
	const mobile_no = useSelector(selectMobileno);
	const [itemDetails, setItemDeails] = useState([]);
	console.log(mobile_no);
	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.get(
				`${API_URL}/feedback_rating/${mobile_no}`
			);
			if (response) {
				console.log(response.data.result);
				setItemDeails(response.data.result);
			}
		};
		fetchData();
	}, []);
	return (
		<>
			<div className="w-[60%]  h-auto m-auto ">
				<h1 className="w-full text-center md:text-4xl justify-center text-[17px]  mt-8">Give Your Feedback about your last experience</h1>
				<div className="md:mt-8 w-full h-auto flex md:flex-row  md:gap-x-8 flex-col items-center justify-center">
					{itemDetails.map((item, index) => (
						<div key={index} className="gap-x-2  ">
							<Rating
								itemID={item.itemID}
								name={item.name}
								imageUrl={item.imageUrl}
								rate={item.rate}
								Pre_count={item.number_of_reviewer}
							/>
						</div>
					))}
				</div>
			
				<Link
					to="/"
					className="w-40 h-16 px-4 py-2 bg-orange-500 flex items-center justify-center m-auto top-20 relative bottom-0 text-white text-xl rounded-lg">
					SKIP
				</Link>
			</div>
		
		</>
	);
}

export default PreFeedback;
