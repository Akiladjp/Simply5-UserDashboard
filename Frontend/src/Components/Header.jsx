import MenuIcon from "@mui/icons-material/Menu";

import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setMenuButtonState } from "../Redux/Slices/MenuButtonSlice";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { BsArrowLeft } from "react-icons/bs";
import { TbReportMoney } from "react-icons/tb";
import {
	selectButtonState,
	setButtonState,
} from "../Redux/Slices/AddbuttonSlice";
import {
	selectCategoryAppearance,
	setCategoryAppearance,
} from "../Redux/Slices/CategaryAppearnceSlice";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { selectMainpageState } from "../Redux/Slices/MainPageSilce";
import { selectItemCount, setItemCount } from "../Redux/Slices/ItemCartCount";
import axios from "axios";
import {
	selectCheckCount,
	selectQuantityCount,
} from "../Redux/Slices/QuantityCountSlice";
import { selectMobileno } from "../Redux/Slices/AuthSlice";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

export default function Header() {
	const API_URL = import.meta.env.VITE_API_URL;
	const dispatch = useDispatch();
	const menubuttonstate = useSelector(selectButtonState);
	const painpagestate = useSelector(selectMainpageState);
	const count = useSelector(selectItemCount);
	const mobile_no = useSelector(selectMobileno);
	const [orderID, setOrderID] = useState([0]);
	const [stateDetails, setStateDetails] = useState([]);
	const prevStatus = useRef(null); // Store previous status

// Fetch state details and manage status updates
useEffect(() => {
	const fetchData = async () => {
		try {
			const response = await axios.get(`${API_URL}/check_state/${mobile_no}`);
			if (response.data) {
				const orderIDList = response.data.result.map((item) => item.orderID);
				setOrderID(orderIDList);
				setStateDetails(response.data.result);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	fetchData();
	const intervalId = setInterval(fetchData, 5000);

	return () => clearInterval(intervalId);
}, [mobile_no]);

// Check for status updates to trigger toastr notifications
useEffect(() => {
	stateDetails.forEach((order) => {
		const { orderID, status: currentStatus } = order;

		// Retrieve the previous status from localStorage for each orderID
		const prevStatus = localStorage.getItem(`${orderID}_prevStatus`);

		// Check if the status has changed
		if (currentStatus !== prevStatus) {
			// Display notification for "pending" status
			if (currentStatus.includes("pending")) {
				toastr.success("Order placed successfully.");
			} 
			else if(localStorage.getItem("preStatus")){
				
				toastr.error("Your Order Can not Accept");
				localStorage.removeItem("preStatus")
			}
			// Display notification for other statuses
			else {
				//  toastr.info(`Order ${orderID} status changed to: ${currentStatus}`);

				if(currentStatus===`${orderID}accept`){
					toastr.success("YOUR ORDER ACCEPTED !");
					setTimeout(() => {
						window.location.reload();
					}, 3000); 
					
				}
				else if(currentStatus===`${orderID}delivered`){
					toastr.success("YOUR ORDER DELIVERED ! ENJOY MEAL ", {"font-size": "20px"});
				}
				else if(currentStatus===`${orderID}reject`){
					toastr.error("YOUR ORDER REJECT ! PLEASE PLACE NEW ORDER ", {"font-size": "20px"});
					setTimeout(() => {
						navigate('/')
					}, 3000); 
				}
			
				
			}
			// Update the previous status in localStorage
			localStorage.setItem(`${orderID}_prevStatus`, currentStatus);
		}
	});
}, [stateDetails]);

	// console.log("stateDtails----------------", stateDtails["status"]);

	const changemenubuttonState = () => {
		dispatch(setMenuButtonState(true));
		dispatch(setCategoryAppearance(true));
	};

	const [checkSize, setCheckSize] = useState(false);
	const divRef = useRef(null);
	const divRef1 = useRef(null);
	//const [clickOutside, setClickOutside] = useState(false);
	const quanityCount = useSelector(selectQuantityCount);
	const checkCount = useSelector(selectCheckCount);
	const addbutton = useSelector(selectButtonState);
	const mobileno = useSelector(selectMobileno);
	useEffect(() => {
		function handleClickedOutSise(event) {
			//selectMenuButtonState(true);

			if (
				divRef.current &&
				!divRef.current.contains(event.target) &&
				!divRef1.current.contains(event.target)
			) {
				if (!menubuttonstate) {
					setCheckSize(false);
					//  setApperance(false);
					dispatch(setCategoryAppearance(false));
					dispatch(setMenuButtonState(false));

					if (menubuttonstate) {
						setMenuButtonState(true);
						dispatch(setCategoryAppearance(true));
					}
				}
			}
		}
		// Attach event listener when component mounts
		document.addEventListener("mousedown", handleClickedOutSise);
		//Clean up event listener when component unmounts
		return () => {
			document.removeEventListener("mousedown", handleClickedOutSise);
		};
	}, []);
	const navigate = useNavigate();

	const handleNavigate1 = () => {
		navigate("/bill");
	};

	const handleNavigate2 = () => {
		navigate("/cart");
	};

	const handlearrow = () => {
		dispatch(setButtonState(false));
		navigate("/");
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(
					`${API_URL}/get_totalPrice/${mobileno}`
				);

				if (response.data.message === "success") {
					dispatch(setItemCount(response.data.count));

					console.log(count);
				} else if (response.data.message === "err") {
					console.log(response.data.totalPrice);
				}
			} catch (err) {
				// console.error("err", err);
			}
		};

		// Trigger when any quantity changes
		fetchData();
	}, [quanityCount, checkCount, addbutton]);

	const [subCategotyValues, setSubCategoryValues] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(`${API_URL}/subcategory`);
				if (response.data && response.data.subCategories) {
					setSubCategoryValues(response.data.subCategories);
				} else {
					console.log("error");
				}
			} catch (err) {
				console.log("error in axios", err);
			}
		};

		fetchData();
		console.log(subCategotyValues);
	}, []);
	return (
		<>
			<div className="fixed top-0 w-full h-[50px] flex items-center justify-between p-2  z-10   lg:w-[60%]  bg-white">
				<button
					onClick={() => {
						setCheckSize(true);

						changemenubuttonState();
						dispatch(setCategoryAppearance(true));
					}}
					className={`${checkSize ? "hidden" : "flex"} ${
						painpagestate ? "flex" : "hidden"
					}`}
					ref={divRef1}>
					<MenuIcon fontSize="large" />
				</button>

				<button
					onClick={() => setCheckSize(false)}
					className={`${
						checkSize ? "flex " : "hidden"
					}`}>
					<CloseIcon fontSize="large" />
	
				</button>

				<div className="px-2 mt-2">
					<button
						onClick={() => {
							handlearrow();
						}}>
							<BsArrowLeft className={`${painpagestate ? "hidden" : " text-3xl font-semibold "}`}/>
						
					</button>
				</div>
				<div className="flex justify-around gap-4 ">
					<button>
						<TbReportMoney
							className="bg-bl text-[34px]"
							onClick={() => {
								handleNavigate1();
							}}
						/>
					</button>
					<button className="h-[30px] w-[30px]  relative">
						<div className="w-[15px] h-[15px] bg-green-700 absolute right-0 flex items-center justify-center rounded-full">
							<p className="text-white text-[10px]  ">{count}</p>
						</div>
						<ShoppingCartCheckoutIcon
							onClick={() => {
								handleNavigate2();
							}}
							fontSize="large"
						/>
					</button>
				</div>
			</div>

			<div
  className={`${
    checkSize
      ? "translate-x-0 md:translate-x-0 transform duration-300  ease-out"
      : "translate-x-[-270px] md:translate-x-[-270px] md:hidden transform duration-300  ease-in"
  } bg-white z-10 fixed top-[50px] bottom-4 overflow-y-auto left-0 rounded-b-md shadow-xl shadow-gray-600 pb-4 h-screen py-4 lg:left-[20%] flex flex-col`}
  ref={divRef}
>
  {subCategotyValues.map((category, index) => (
    <ul
      className="text-lg flex flex-col w-[270px] items-center pb-8 h-auto relative justify-around py-2"
      key={index}
    >
      <li
        className="font-bold flex flex-col gap-2 cursor-pointer"
        onClick={() => {
          dispatch(setCategoryAppearance(false));
          setCheckSize(false);
          navigate(`/subcategoryitem/${encodeURIComponent(category.name)}`);
        }}
      >
        {category.name}
      </li>
      {category.items &&
        category.items.map((item, itemIndex) => (
          <li key={itemIndex}>{item.name}</li>
        ))}
    </ul>
  ))}
</div>

		</>
	);
}

// Header.propTypes = {
//   setApperance: PropTypes.func.isRequired,
// };
// Header.defaultProps = {
//   setAppearance: () => {}, // This should be a function
// };
