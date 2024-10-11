import { createBrowserRouter, RouterProvider, Outlet, useNavigate } from "react-router-dom";
import Header from "./Components/Header";

import MainPage from "./pages/MainPage";

import ItemList from "./pages/ItemList";
import { Provider, useSelector } from "react-redux";
import { store } from "./Redux/Store";
import "./App.css";
import { useEffect, useState } from "react";
import { selectButtonState } from "./Redux/Slices/AddbuttonSlice";
import Cart from "./Components/Cart";
import Login from "./Components/UserRegister";
import PopOrder from "./Components/PopOrder";
import ItemCart from "./Components/ItemCart";
import Bill from "./pages/Bill";
import { selectCategoryAppearance } from "./Redux/Slices/CategaryAppearnceSlice";
import Testimage from "./pages/Testimage";
import Category from "./Components/MainCategories/Category";
import RatingPage from "./pages/RatingPage";
import Rating from "./Components/rating/Rating";
import { selectUsername } from "./Redux/Slices/AuthSlice";
import SubCategoryItem from "./Components/SubCategoruItem";
import PreFeedback from "./pages/PreFeedback";
const Layout = () => {
	const navigate = useNavigate();
	const username = useSelector(selectUsername);
	const buttonState = useSelector(selectButtonState);
	const categoryAppearance = useSelector(selectCategoryAppearance);

	useEffect(() => {
        if (!username) {
            navigate("/login/:id");
        }
    }, [username, navigate]);

	return (
		<div className="flex flex-col h-screen  overflow-hidden lg:w-[60%] lg:left-[20%] lg:right-[20%] lg:absolute">
			<div className="absolute z-10">
				<Header />
			</div>
			<div
				className={`${
					categoryAppearance
						? "blur-sm lg:w-[60%] fixed z-0 "
						: "w-full absolute h-screen z-0 overflow-scroll "
				} ${
					buttonState
						? "blur-0 h-screen w-full fixed z-0 "
						: "top-[50px] w-full"
				}`}>
				<Outlet />
			</div>
			<div
				className={`${
					categoryAppearance ? "blur-md overflow-hidden" : "blur-0"
				} flex top-[50px] -z-0 w-full mt-16 mb-auto items-center justify-center`}></div>
		</div>
	);
};

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{ path: "/", element: <MainPage /> },
			{ path: "/itemlist", element: <ItemList /> },
			{ path: "/cart", element: <Cart /> },
			{ path: "/category", element: <Category /> },
			{ path: "/bill", element: <Bill /> },
			{ path: "/ratingpage/:order_id", element: <RatingPage /> },

			{ path: "/subcategoryitem/:id", element: <SubCategoryItem /> },
		],
	},

	{ path: "/login/:id", element: <Login /> },
	{ path: "/give-you-feedback", element: <PreFeedback /> },
	{ path: "/itemcart", element: <ItemCart /> },
	{ path: "/test", element: <Testimage /> },
	{ path: "/rating", element: <Rating /> },
	{ path: "/popupcart", element: <PopOrder /> },
]);

function App() {
	return (
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	);
}

export default App;
