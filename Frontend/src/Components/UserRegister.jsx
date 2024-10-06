import { useEffect, useState } from "react";
import Logo from "../assets/Images/logo.png";
import { FaPhoneAlt, FaUser } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css"; // To include the styles

import "react-phone-input-2/lib/style.css";
import { selectUsername, setUservalue } from "../Redux/Slices/AuthSlice";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
	const dispatch = useDispatch();
	const username = useSelector(selectUsername);
	const navigate = useNavigate();
	const {id: tableNo } = useParams();

	useEffect(() => {
		if (username) {
			navigate("/");
		}
	}, [username, navigate]);

	useEffect(() => {
		console.log("Table Number:", tableNo);
	  }, [tableNo]);

	const API_URL = import.meta.env.VITE_API_URL;
	const [values, setValues] = useState({
		name: "",
		phoneNo: "",
	});

	const validatePhoneNumber = (phoneNo) => {
		const phoneRegex = /^\d{10}$/;
		return phoneRegex.test(phoneNo);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validatePhoneNumber(values.phoneNo)) {
			alert("Phone number must contain exactly 10 digits.");
			return;
		}

		try {
			const response = await axios.post(`${API_URL}/userlogin`, values);
			console.log(values);
			dispatch(
				setUservalue({ username: values.name, mobileno: values.phoneNo })
			);

			if (response.data.message === "already") {
				navigate("/give-you-feedback");
				toastr.success("Welcome Back", { timeout: 300 });
			} else {
				navigate("/");
				toastr.success("Welcome ", { timeout: 300 });
			}
		} catch (err) {
			console.log(err);
			toastr.error("Login failed. Please try again.");
		}
	};

	return (
		<div className="w-full h-screen">
			<Link to="/cart"></Link>

			<div className="flex mx-auto mt-16 w-60">
				<img src={Logo} alt="Logo" />
			</div>
			<div className="flex justify-center w-[260px] mx-auto">
				<form onSubmit={handleSubmit} method="post">
					<div className="flex border-b-[2px] mb-8 h-10">
						<FaUser className="my-auto ml-2" />
						<input
							className="w-[260px] ml-6 outline-none"
							type="text"
							name="username"
							required
							id="username"
							placeholder="Full name"
							onChange={(e) => setValues({ ...values, name: e.target.value })}
						/>
					</div>
					<div className="flex border-b-[2px] mb-8 h-10">
						<FaPhoneAlt className="my-auto ml-2" />
						<input
							className="w-[260px] ml-6 outline-none"
							type="text"
							name="phone"
							id="phone"
							required
							placeholder="Phone Number"
							onChange={(e) =>
								setValues({ ...values, phoneNo: e.target.value })
							}
						/>
					</div>
					<div>
						<input
							className="w-[310px] mb-8 font-bold h-10 rounded-2xl mt-2 bg-[#FED991] shadow-md"
							type="submit"
							name="submit"
							id="submit"
							value="REGISTER"
						/>
					</div>
				</form>
			</div>
			<div>
				<p className="text-[6px] md:text-[8px] flex justify-center">
					By signing in or creating an account, you agree with our&nbsp;
					<span className="text-blue-600">Terms & conditions</span> &nbsp;and&nbsp;{" "}
					<span className="text-blue-600">Privacy statement</span>
				</p>

				<p className="text-[6px] flex justify-center">All Rights Reserved</p>
			</div>
		</div>
	);
};

export default Login;
