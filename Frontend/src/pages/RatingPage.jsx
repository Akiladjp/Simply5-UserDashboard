import { useEffect, useState } from "react";
import { LgBtn } from "../Components/rating/LgBtn";
import Rating from "../Components/rating/Rating";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { selectMobileno } from "../Redux/Slices/AuthSlice";
import { useParams } from "react-router-dom";
import { setMainpageState } from "../Redux/Slices/MainPageSilce";

const RatingPage = () => {
	const API_URL = import.meta.env.VITE_API_URL;
	const mobile_no = useSelector(selectMobileno);
	const dispatch = useDispatch();
	const { order_id } = useParams();
	const [reaction, setReaction] = useState("");
	console.log(" in rating page:", order_id);

	const [itemDetails, setItemDeails] = useState([]);

	const changeMainpagestate = () => {
		dispatch(setMainpageState(false));
	};
	useEffect(() => {
		changeMainpagestate();
	}, []);
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

	const handleReaction = (event) => {
		event.preventDefault();
		const selectedReaction = event.target.value;
		setReaction(selectedReaction);
		console.log(selectedReaction); // Log the value directly
	};
	return (
		<div className=" h-screen overflow-hidden ">
			<div className=" flex flex-col  h-full overflow-scroll ">
				<div className="flex justify-center gap-x-8 flex-wrap w-full   ">
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
				<div className="w-full h-auto md:w-[80%] md:m-auto ">
					<form>
						<div className="flex flex-col  md:flex-row items-center px-4 gap-4 mt-4 justify-center">
							<h1>What is your idea about customer service?</h1>
							<div className="flex gap-4 w-full justify-center items-center flex-col">
								{/* submit_container */}
								<div
									className={`${
										reaction
											? "hover:scale-105 hover:mb-6 b w-full h-20 flex items-center justify-center"
											: "hidden"
									}`}>
									<span className="text-4xl">
										{reaction === "Excellent"
											? "🤩"
											: reaction === "Good"
											? "👍"
											: "😒"}
									</span>
								</div>

								{/* button_container */}
								<div
									className={`${
										reaction
											? "hidden"
											: " w-full h-20 flex items-center justify-center gap-x-4"
									}`}>
									<button
										className="text-4xl hover:scale-105 hover:mb-6"
										value="Excellent"
										onClick={(e) => handleReaction(e)}>
										🤩
									</button>
									<button
										className="hover:scale-105 hover:mb-6 text-4xl"
										onClick={(e) => handleReaction(e)}
										value="Good">
										👍
									</button>
									<button
										className="text-4xl hover:scale-105 hover:mb-6"
										onClick={(e) => handleReaction(e)}
										value="Bad">
										😒
									</button>
								</div>
							</div>
						</div>
						<div className="px-4 py-2">
							<textarea
								className="w-full px-2 py-2 outline-none h-40 border-2 border-black rounded-md"
								placeholder="Please share your thoughts"
							/>
							<input
								type="submit"
								name=""
								value={"Share With US"}
								id=""
								className="bg-green-500 py-1 px-2 font-semibold rounded-lg mt-4 "
							/>

							<div className="h-40  w-full"></div>
						</div>
					</form>
				</div>
			</div>

			<div className="  bg-white fixed bottom-0 md:w-[60%] w-full flex items-center justify-center z-10">
				<LgBtn />
			</div>
		</div>
	);
};

export default RatingPage;
