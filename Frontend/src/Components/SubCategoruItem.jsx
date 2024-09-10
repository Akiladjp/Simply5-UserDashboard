import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { setMainpageState } from "../Redux/Slices/MainPageSilce";
import axios from "axios";
import ScrollToTop from "./ScrollTop";
import { selectButtonState } from "../Redux/Slices/AddbuttonSlice";
import PopOrder from "./PopOrder";
import ItemCart from "./ItemCart";

function SubCategoryItem() {
	const API_URL = import.meta.env.VITE_API_URL;
	const [Mealitems, setMealitems] = useState([]);

	const buttonState = useSelector(selectButtonState);

	const { id } = useParams();
	console.log(id);
	const dispatch = useDispatch();
	
	const changeMainpagestate = () => {
		dispatch(setMainpageState(false));
	};
	useEffect(() => {
		changeMainpagestate();
	}, [id]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axios.get(
					`${API_URL}/subcategoryitems?category=${id}`
				);
				if (res) {
					const items = res.data.result || [];
					setMealitems(items);
				} else if (res.data.Message == "Error inside server") {
					console.log("Error inside server");
				}
			} catch (err) {
				console.error(err);
			}
		};
		fetchData();
	}, []);
	return (
		<div className="w-full   top-[50px]  h-auto pb-2">
			<ScrollToTop />
			<div className=" w-full items-center justify-center h-12 flex text-2xl font-semibold">
				<h1>{id}</h1>
			</div>
			<div
				className={`${
					buttonState
						? " blur-md flex items-center justify-around h-auto py-2 mt-8 flex flex-wrap items-center justify-center gap-8 mt-4"
						: "flex flex-wrap items-center justify-center gap-8 mt-4"
				}`}>
				{Mealitems.length > 0 &&
					Mealitems.map((item, index) => (
						<>
							<div key={item.itemID}>
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
			</div>
			<div
				className={`${
					buttonState
						? " absolute m-auto z-10 flex justify-center w-full overflow-hidden   items-center top-0 bottom-0"
						: " hidden"
				} `}>
				<PopOrder />
			</div>
		</div>
	);
}

export default SubCategoryItem;
