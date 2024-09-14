import { RiStarSFill } from "react-icons/ri";
import { useState } from "react";
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css"; // To include the styles
const Rating = (props) => {
	const [hover, setHover] = useState(null);
	const [rating, setRating] = useState(null);
	const [totalRate, setTotalRate] = useState(props.rate || 0);
	const API_URL = import.meta.env.VITE_API_URL;
	const [isDone, setIsDone] = useState(false);

	console.log("rate and rewvers", props.rate, props.Pre_count);
	const handelsubmit = (event) => {
		event.preventDefault(); // Prevent the default form submit behavior
		console.log("Submitting Rating:", props.itemID, rating); // Print itemID and rating
		if (rating != null) {
			calculate_rate(rating);
		} else {
			toastr.error("Plase select your stars!");
		}
	};
	const calculate_rate = (hover) => {
		let points = 0;
		if (hover === 1) {
			points = 1;
		} else if (hover === 2) {
			points = 2;
		} else if (hover === 3) {
			points = 3;
		} else if (hover === 4) {
			points = 4;
		} else if (hover === 5) {
			points = 5;
		}

		let newTotal;
		if (props.Pre_count === null || props.Pre_count === 0) {
			newTotal = points;
		} else {
			newTotal =
				(props.Pre_count * props.rate + points) / (props.Pre_count + 1);
		}

		setTotalRate(newTotal);
		console.log("new total", newTotal);
		updateRating(props.itemID, newTotal);
	};

	const updateRating = async (id, rating) => {
		try {
			const response = await axios.put(`${API_URL}/rating_updateRate`, {
				id,
				rating,
			});
			if (response.status === 200) {
				console.log(response.data.message);
			} else {
				console.log(response.data.message);
			}
		} catch (error) {
			console.error("Error updating rating:", error);
		}
	};

	const hanleDesapear = () => {
		if (rating != null) {
			setIsDone(true);
		}
	};

	return (
		<>
			<div className="flex justify-center w-full scale-90 md:scale-100 flex-col">
				<div
					className={`${
						isDone
							? "hidden"
							: "w-[400px] h-[200px] flex mt-4 rounded-lg shadow-md"
					}`}>
					<div className="w-[220px] h-[200px] rounded-lg">
						<img
							src={props.imageUrl}
							alt=""
							className="h-[200px] rounded-l-lg"
						/>
					</div>
					<div className="w-[200px] h-[200px] flex flex-col gap-4 m-4">
						<h1 className="text-[20px] font-bold">{props.name}</h1>
						<div className="flex text-[18px]">
							<RiStarSFill size={25} className="mt-1 mr-4 text-[#ffc107]" />
							<p className="text-[20px]">{props.rate}</p>
						</div>

						{/* Rating add */}
						<div>
							<form onSubmit={handelsubmit}>
								<div>
									{[...Array(5)].map((star, index) => {
										const currenRating = index + 1;

										return (
											<label key={index}>
												<input
													type="radio"
													name="rating"
													value={currenRating}
													onClick={() => setRating(currenRating)}
													className="appearance-none"
												/>
												<RiStarSFill
													size={30}
													className="inline cursor-pointer"
													color={
														currenRating <= (hover || rating)
															? "#ffc107"
															: "#e4e5e9"
													}
													onMouseEnter={() => setHover(currenRating)}
													onMouseLeave={() => setHover(null)}
												/>{" "}
											</label>
										);
									})}
								</div>
								<div className="flex justify-end mt-2 mr-2">
									<button
										type="submit"
										className="px-2 py-1 font-bold bg-green-500 rounded-lg"
										onClick={() => {
											hanleDesapear();
										}}>
										Submit
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Rating;
