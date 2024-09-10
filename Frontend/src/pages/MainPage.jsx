import { useEffect, useState } from "react";
import ItemCart from "../Components/ItemCart";
import Slider from "../Components/Slider";
import { useDispatch, useSelector } from "react-redux";
import { selectButtonState } from "../Redux/Slices/AddbuttonSlice";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";
import CategoryCart from "../Components/CategoryCart";
import axios from "axios";
import { setMainpageState } from "../Redux/Slices/MainPageSilce";

import PopOrder from "../Components/PopOrder";
import ScrollToTop from "../Components/ScrollTop";
import {
	selectCheckCount,
	selectQuantityCount,
	setCheckCount,
} from "../Redux/Slices/QuantityCountSlice";
import { setItemCount } from "../Redux/Slices/ItemCartCount";

const category = [
	{
		CName: "Meal",
		path: "https://timelinecovers.pro/facebook-cover/download/burger-with-french-fries-facebook-cover.jpg",
		navigate_path: "/category",
	},
	{
		CName: "Drinks",
		path: "https://www.beerpassclub.com/wp-content/uploads/2023/11/cocktail-glasses-scaled.webp",
		navigate_path: "/category",
	},
	{
		CName: "Desserts",
		path: "https://recipes.net/wp-content/uploads/2020/12/tiramisu-ice-cream-cake-recipe-1024x768.jpg",
		navigate_path: "/category",
	},
];

export default function MainPage() {
	const dispatch = useDispatch();
	const buttonState = useSelector(selectButtonState);
	const [hotDealsItems, setHotDealsItems] = useState([]);
	const checkCount = useSelector(selectCheckCount);
	const API_URL = import.meta.env.VITE_API_URL;
	//const [links, setLinks] = useState([]);
	const changeMainpagestate = () => {
		dispatch(setMainpageState(true));
	};
	useEffect(() => {
		changeMainpagestate();
		if (checkCount == false) {
			dispatch(setCheckCount(true));
		} else {
			dispatch(setCheckCount(false));
		}
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axios.get(`${API_URL}/itemcard`);

				const items = res.data.result || [];

				setHotDealsItems(items);
			} catch (err) {
				console.error(err);
			}
		};
		fetchData();
	}, []);

	return (
		<div
			className={`${
				buttonState ? " " : " relative flex flex-col w-full h-auto "
			}`}>
			<ScrollToTop />
			<div className={`${buttonState ? "blur-md" : ""}`}>
				<Slider arrows={false} />
			</div>

			<div
				className={`${
					buttonState
						? "blur-md flex items-center justify-around h-auto py-2 mt-8"
						: "flex items-center justify-around h-auto py-2 mt-8"
				}`}>
				<div className="bg-black h-1 w-[20%] sm-w-40 lg:w-[30%]"></div>
				<h1 className="text-2xl font-semibold">HOT DEALS</h1>
				<div className="bg-black h-1 w-[20%] lg:w-[30%]"></div>
			</div>

			<div className="flex w-full  justify-center items-center m-auto">
				<div
					className={`${
						buttonState
							? "blur-sm flex items-center justify-start lg:px-24"
							: "  mt-6 grid grid-cols-1 gap-x-4 lg:gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 "
					}`}>
					{hotDealsItems.length > 0 &&
						hotDealsItems.map((item, index) => (
							<div key={item.itemID} className="">
								<ItemCart
									itemID={item.itemID}
									buttonTitle="ADD"
									name={item.name}
									time={item.prepare_time}
									rating={item.rate}
									//rating={1.0}
									price={`Rs .${item.price}`}
									image={item.image_url}
								/>
							</div>
						))}
				</div>
			</div>

			<div
				className={`${
					buttonState
						? "flex blur-sm items-center justify-around h-auto py-2 mt-8"
						: "flex items-center justify-around h-auto py-2 mt-8"
				}`}>
				<div className="bg-black h-1 w-[20%] sm-w-40 lg:w-[30%]"></div>
				<h1 className="text-2xl font-semibold">Main Categories</h1>
				<div className="bg-black h-1 w-[20%] lg:w-[30%]"></div>
			</div>

			{category.map((cat, index) => (
				<Link
					to={`${cat.navigate_path}`}
					state={{ category: cat.CName }}
					key={index}>
					<div
						className={`${
							buttonState
								? "blur-sm flex  items-start justify-center gap-4 mt-4"
								: "flex  flex-col items-center justify-center gap-4 mt-4 "
						}`}>
						<div className="relative ">
							<div
								style={{
									backgroundImage: `url(${cat.path})`,
									backgroundPosition: "center",
									backgroundSize: "cover",
								}}
								className="flex items-center justify-center rounded-lg border-none w-[360px] h-[180px] object-cover bg-gradient-to-r from-customYellow to-white bg-no-repeat md:w-[700px]">
								<p
									className="z-10 text-5xl font-semibold tracking-wider text-transparent stroke-6 stroke-white hover:text-7xl"
									style={{
										transition: "opacity 1s",
										WebkitTextStroke: "1px white",
									}}>
									{cat.CName}
								</p>
							</div>
						</div>
					</div>
				</Link>
			))}
			<div className="flex flex-col items-center justify-around w-full h-auto py-2 mt-6">
				<div className="flex items-center justify-around w-full h-auto py-2">
					<div className="bg-black h-1 w-[20%] sm-w-40 lg:w-[30%]"></div>
					<h1 className="text-2xl font-semibold">ALL Categories</h1>
					<div className="bg-black h-1 w-[20%] lg:w-[30%]"></div>
				</div>

				<div className="flex  w-[95%] gap-2 lg:w-[70%] ">
					<CategoryCart />
				</div>
			</div>

			<div
				className={`${
					buttonState
						? " absolute m-auto z-10 flex justify-center w-full overflow-hidden   items-center top-0 bottom-0"
						: " hidden"
				} `}>
				<PopOrder />
			</div>
			<div className="top-0 w-full mt-0">
				<Footer />
			</div>
		</div>
	);
}
