import { useEffect, useState } from "react";
import { LgBtn } from "../Components/rating/LgBtn";
import Rating from "../Components/rating/Rating";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { selectMobileno } from "../Redux/Slices/AuthSlice";
import { useParams } from "react-router-dom";
import { setMainpageState } from "../Redux/Slices/MainPageSilce";
import { FaFacebook } from "react-icons/fa";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
const RatingPage = () => {
	const API_URL = import.meta.env.VITE_API_URL;
	const mobile_no = useSelector(selectMobileno);
	const dispatch = useDispatch();
	const { order_id } = useParams();
	const empID = 1;
	const [reaction, setReaction] = useState("");
	const [feedbackValue, setFeedbackValue] = useState({ message: "" });
	const [thank_Disappear, setThank_Disappear] = useState(false);

	// console.log(" in rating page:", order_id);

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
		event.preventDefault(); // Prevent page refresh
		const selectedReaction = event.target.value;
		setReaction(selectedReaction);
		setFeedbackValue((prevState) => {
			if (prevState.message === "") {
				return {
					...prevState,
					message: selectedReaction,
				};
			}
			return prevState;
		});
	};

	console.log(feedbackValue["message"]);
	const handleChange = (event) => {
		event.preventDefault();
		const comment = reaction + " " + event.target.value;

		setFeedbackValue({
			...feedbackValue,
			message: comment,
		});
		// state might not update immediately when you call setState. If you try to update the state based on its current value without using the functional form (i.e., without using prev), React might not have applied the latest state yet, leading to issues when you rely on outdated state values.
	};

	const handleSubmit = async (event) => {
		// Should log "function"
		event.preventDefault();
		if (feedbackValue["message"]!="") {
			try {
				const response = await axios.post(
					`${API_URL}/add_service/${empID}`,
					feedbackValue,
					{
						headers: { "Content-Type": "application/json" },
					}
				);
				console.log(response.data);
				if (response.status === 200) {
					setThank_Disappear(true);
				} else {
					console.log(response.data.message);
				}
			} catch (err) {
				console.log("error  in adding service ", err);
			}
		} else {
			toastr.warning("Please Add you reaction or comment");
		}
	};
	return (
		<>
			<div className=" h-screen   w-full flex">
				<div className=" flex flex-col  h-full overflow-scroll w-full">
					<div className="flex justify-center gap-x-8 flex-wrap w-full  h-auto flex-col md:flex-row  ">
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
						<form onSubmit={handleSubmit}>
							<div className="flex flex-col  md:flex-row items-center px-4 gap-4 mt-4 justify-center  w-full">
								<h1>What is your idea about customer service?</h1>
								<div className="flex gap-4 w-full justify-center items-center flex-col">
									{/* submit_container */}
									<div
										className={`${
											reaction
												? "  b w-full h-20 flex items-center justify-center"
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
									name="comment"
									onChange={handleChange}
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
				<div
					className={
						thank_Disappear
							? "w-full h-screen bg-fuchsia-400 absolute flex items-center justify-center bottom-2 left-2"
							: "hidden"
					}>
					<span className="text-2xl w-full text-center">
						Thank you for your valuable feedback!
					</span>
				</div>
			</div>
		</>
	);
};

export default RatingPage;
