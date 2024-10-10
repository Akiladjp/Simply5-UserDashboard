import { Link, useNavigate } from "react-router-dom";
import ItemCart from "./ItemCart.jsx";
import { useDispatch, useSelector } from "react-redux";
import ScrollToTop from "./ScrollTop.jsx";
import { useEffect, useState } from "react";
import { setMainpageState } from "../Redux/Slices/MainPageSilce.js";
import axios from "axios";
import { selectMobileno } from "../Redux/Slices/AuthSlice.js";
import {
	selectCheckCount,
	selectQuantityCount,
} from "../Redux/Slices/QuantityCountSlice.js";
import { setItemCount } from "../Redux/Slices/ItemCartCount.js";
import {
	selectButtonState,
	setButtonState,
} from "../Redux/Slices/AddbuttonSlice.js";
import toastr from "toastr";

export default function Cart() {
	const dispatch = useDispatch();
	const API_URL = import.meta.env.VITE_API_URL;
	const [cartValues, setCartValues] = useState({
		result: [],
		add_cart_item_quanity: [],
	});
	const [add_cartValue, setadd_cart_values] = useState([]);
	const mobileno = useSelector(selectMobileno);
	const [totalPrice, setTotalPrice] = useState(0);
	const [count, setCount] = useState(0);
	const quanityCount = useSelector(selectQuantityCount);

	const changeMainpagestate = () => {
		dispatch(setMainpageState(false));
	};

	useEffect(() => {
		changeMainpagestate();

		const fetchData = async () => {
			try {
				const response = await axios.get(
					`${API_URL}/get_cartValues?mobileno=${mobileno}`
				);
				if (response && response.data.result) {
					setCartValues({
						result: response.data.result,
						add_cart_item_quanity: response.data.add_cart_item_quanity,
					});
				} else if (response.data.message === "err") {
					console.log(response.data.message);
				}
			} catch (err) {
				console.error("err", err);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					`${API_URL}/get_totalPrice/${mobileno}`
				);

				if (response.status === 200) {
					setTotalPrice(response.data.totalPrice || "null");
				} else {
					console.log("Error is ", response.data.message);
				}
			} catch (err) {
				console.error("err", err);
			}
		};

		fetchData();
	}, [quanityCount]);

	//call delete API

	const handleDelete = async (mobileno) => {
		try {
			await axios.delete(`${API_URL}/delete_cartValues/${mobileno}`);
			location.reload();
		} catch (err) {
			console.log(err);
		}
	};

	//Place Order

	const navigate = useNavigate();
console.log(totalPrice)
const handleOrder = async (mobileno) => {
  try {
    // Ensure totalPrice is greater than zero
    if (totalPrice > 0) {
      const order = {
        mobileno: mobileno,
        tableno: 1,
        status: "pending",
        total: (totalPrice + totalPrice * 0.1).toFixed(2), // Add 10% to totalPrice
        time: new Date().toLocaleTimeString(),
        date: new Date().toISOString().split("T")[0],

        items: cartValues.result.map((cart, index) => ({
          itemID: cart.itemID,
          quantity: cartValues.add_cart_item_quanity[index],
        })),
      };

      // Send the order via a POST request
      await axios.post(`${API_URL}/create_order/${mobileno}`, order);

      // Navigate to the bill page after successful order
      navigate("/bill");
    } else {
      console.log("Please ensure the total price is greater than zero.");
    }
  } catch (err) {
    console.error("Error placing order:", err);
  }
};

	return (
		<>
			<div className="bottom-0 w-full h-screen overflow-hidden">
				{/* Header Component */}
				<ScrollToTop />

				<div className="flex flex-wrap justify-start w-full gap-5 p-2 bg-white mt-[20px] mb-[250px] h-[700px] overflow-scroll pb-40 ">
					{cartValues.result.map((cart, index) => (
						<ItemCart
							key={index}
							itemID={cart.itemID}
							buttonTitle="Remove"
							quantity={cartValues.add_cart_item_quanity[index]} // Accessing the quantity based on the index
							name={cart.name}
							time={cart.prepare_time}
							rating={cart.rate}
							price={`Rs. ${cart.price}`}
							image={cart.image_url}
						/>
					))}
				</div>
				<div className="border-[2px] z-20 bottom-0 fixed w-full shadow-top rounded-t-3xl pt-8 pb-8 bg-white h-[240px] shadow-lg lg:w-[60%]">
					<div className="flex justify-between mx-2 text-[18px] mb-3 font-bold">
						<div>Order Price</div>
						<div>{isNaN(totalPrice) ? "Rs. 0.0" : "Rs."+Math.round(totalPrice)}</div>

					</div>
					<div className="flex justify-between mx-2 text-[18px] mb-3 font-bold">
						<div>Service Charge</div>
						<div>{isNaN(totalPrice) ? "Rs. 0.0" : "Rs."+Math.round(totalPrice * 0.1)}</div>
						
					</div>
					<div className="flex justify-between mx-2 text-[18px] mb-3 font-bold">
						<div>Total Price</div>
						<div>{isNaN(totalPrice) ? "Rs.0.0" : "Rs."+Math.round(totalPrice + totalPrice * 0.1)}</div>
				
					</div>
					<div className="flex items-center justify-center gap-8 mb-2 ">
						<Link to="/">
							<button
								className="bg-[#E12114] py-1 w-20 rounded-md shadow-lg my-2 text-white uppercase font-bold"
								onClick={() => handleDelete(mobileno)}>
								cancel
							</button>
						</Link>
						<Link>
							<button
								className="bg-[#28A745] py-1 w-20 rounded-md shadow-lg my-2 text-white uppercase font-bold :"
								
								onClick={() => handleOrder(mobileno)}>
								order
							</button>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
