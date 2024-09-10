import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

import { setButtonState } from "../Redux/Slices/AddbuttonSlice";
import { setMenuButtonState } from "../Redux/Slices/MenuButtonSlice";
import { selectCategoryAppearance } from "../Redux/Slices/CategaryAppearnceSlice";
import { ClipLoader } from "react-spinners";
import { setItemID } from "../Redux/Slices/ItemIdSlider";
import {
	selectaddCount,
	setbuttonCount,
} from "../Redux/Slices/AddbuttonCountSlice";
import axios from "axios";
import { selectMobileno } from "../Redux/Slices/AuthSlice";
import { selectQuantityCount, setQuantityCount } from "../Redux/Slices/QuantityCountSlice";

export default function ItemCart({
	itemID = 0,
	buttonTitle = "",
	quantity = 0,
	name = "",
	time = 0,
	rating = 0,
	price = "",
	image = "",
}) {
	const dispatch = useDispatch();
	const categoryAppearance = useSelector(selectCategoryAppearance);
	const addbuttoncount = useSelector(selectaddCount);
	const API_URL = import.meta.env.VITE_API_URL;
	const [count, setcount] = useState(quantity);
	const [loading, setloading] = useState(true);
	const mobileno = useSelector(selectMobileno);

	const handleLoad = () => {
		setloading(false);
	};

	useEffect(() => {
		if (categoryAppearance) {
			dispatch(setButtonState(false));
		}
	}, [categoryAppearance, dispatch]);

	const changeButtonState = () => {
		dispatch(setbuttonCount(addbuttoncount + 1));
		if (!categoryAppearance) {
			dispatch(setButtonState(true));
		} else {
			dispatch(setMenuButtonState(false));
		}
	};

	const addTocart = (itemid) => {
		dispatch(setItemID(itemid));
	};

	const item_remove_fromBackend = async (itemid) => {
		try {
			const response = await axios.delete(
				`${API_URL}/addcart/removeitem_from_cart`,
				{
					data: { itemid }, // Pass itemid in the request body
				}
			);

			if (response.data.message === "success") {
				console.log("Item removed successfully");
				window.location.reload();
			} else {
				console.log("Error: Item could not be removed.");
			}
		} catch (err) {
			console.log("Error:", err);
		}
	};

	const countChange = async (newCount, itemID, mobileno) => {
		if (newCount > 0) {
      dispatch(setQuantityCount(count))
			console.log(itemID, mobileno, "count", newCount);
			try {
				const response = await axios.put(`${API_URL}/update_quantity`, {
					count: newCount,
					itemID,
					mobileno, 
				});

				if (response.data.message === "success") {
					console.log("Item quantity updated successfully.");
					setcount(newCount); // Update state with the new count
				} else if (response.data.message === "err") {
					console.log("Quantity not updated!");
				} else {
					console.log("Unexpected response message:", response.data.message);
				}
			} catch (err) {
				console.error("Error updating item quantity:", err);
			}
		}
	};

	return (
		<div
			className={`flex flex-col items-center justify-start  ${
				buttonTitle !== "ADD" ? "h-[300px] w-[160px]" : "h-[280px] w-40"
			} pb-2 overflow-hidden  shadow-xl rounded-xl shadow-slate-400`}>
			{loading && (
				<div>
					<ClipLoader size={60} color={"#000"} loading={loading} />
				</div>
			)}
			<div className="overflow-hidden w-[160px] h-[140px] object-contain ">
			<img
				src={image}
				alt=""
				className="  w-full h-full object-cover overflow-hidden "
				style={loading ? { display: "none" } : {}}
				onLoad={handleLoad}
			/></div>
			<div className="flex flex-col items-start gap-2 p-2">
				<div>
					<h1 className="text-md text-wrap">{name}</h1>
				</div>
				<div className="flex items-center w-full gap-6">
					<div className="flex items-end justify-end gap-1">
						<i className="text-green-700">
							<AccessAlarmsIcon fontSize="small" />
						</i>
						<p className="text-[12px] text-green-700">{time}</p>
					</div>
					<div className="flex items-end justify-center gap-1">
						<i className="text-red-700">
							<StarOutlineIcon fontSize="small" />
						</i>
						<p className="text-sm text-red-700">{rating}</p>
					</div>
				</div>
				<div className="flex items-center justify-between w-full gap-4 ">
					<p className="text-sm font-semibold ">{price}</p>
					{buttonTitle === "ADD" ? (
						<button
							disabled={categoryAppearance}
							onClick={() => {
								changeButtonState();
								addTocart(itemID);
							}}
							className=" py-1 px-2 font-semibold text-white bg-green-800 rounded text-[12px]">
							{buttonTitle}
						</button>
					) : (
						<div className="px-2 py-1 flex font-semibold text-white  rounded text-[16px] gap-x-2 border-2">
							<button
								className="text-black "
								onClick={async () => {
									const newCount = count - 1; // Use the current count state
									await countChange(newCount, itemID, mobileno);
								}}>
								-
							</button>
							<p className="text-black ">{count}</p>
							<button
								className="text-black "
								onClick={async () => {
									const newCount = count + 1; // Use the current count state
									if (newCount > 0) {
										await countChange(newCount, itemID, mobileno);
									}
								}}>
								+
							</button>
						</div>
					)}
				</div>
				{buttonTitle !== "ADD" && (
					<div
						className="flex w-full "
						onClick={() => {
							item_remove_fromBackend(itemID);
						}}>
						<button className="flex justify-center float-left px-2 py-1 m-auto text-sm text-white bg-red-600 rounded item-center">
							Remove
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

// ItemCart.propTypes = {
// 	itemID: PropTypes.number.isRequired,
// 	buttonTitle: PropTypes.string.isRequired,
// 	quantity: PropTypes.number.isRequired,
// 	name: PropTypes.string.isRequired,
// 	time: PropTypes.number.isRequired,
// 	rating: PropTypes.number.isRequired,
// 	price: PropTypes.string.isRequired,
// 	image: PropTypes.string.isRequired,
// };
