import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMainpageState } from "../Redux/Slices/MainPageSilce";
import { Link } from "react-router-dom";
import { selectMobileno } from "../Redux/Slices/AuthSlice";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const Bill = () => {
  const dispatch = useDispatch();

  const changeMainpagestate = () => {
    dispatch(setMainpageState(false));
  };
  useEffect(() => {
    changeMainpagestate();
  }, []);
  const foodData = [
    { item: "Pizza", rate: "1000", qty: 2, amount: "$20" },
    { item: "Burger", rate: "900", qty: 3, amount: "$15" },
    { item: "Pasta", rate: "1100", qty: 2, amount: "$16" },
    { item: "Ice Cream", rate: "250", qty: 2, amount: "$8" },
  ];

  const mobileno = useSelector(selectMobileno);

  const [billData, setBillData] = useState({
    billNo: "",
    date: "",
    time: "",
    item: "",
    rate: "",
    quantity: "",
    amount: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      console.log(mobileno);
      try {
        const response = await axios.get(`${API_URL}/billSection/${mobileno}`);
        if (response) {
          setBillData({
            billNo: "",
            date: "",
            time: "",
            item: "",
            rate: "",
            quantity: "",
            amount: "",
          });
        } else {
          console.log("Error in query");
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-screen p-6 bg-gray-100 lg:w-3/5 lg:m-auto">
      {/* Header Section */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-extrabold uppercase text-gray-800 tracking-wide">
          Roseluxury Hotel
        </h1>
        <h3 className="text-sm text-gray-500 mt-2">Hotline: 021 55 55 222</h3>
      </div>

      {/* Booking Details */}
      <div className="flex w-full justify-between gap-8 px-6 py-4 bg-white rounded-lg shadow-lg mb-6">
        <div className="flex items-center">
          <p className="text-gray-700 font-semibold">B. No:</p>
          <span className="ml-2 text-gray-600">123456</span>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-gray-700">
            Date: <span className="font-medium">09/10/2024</span>
          </p>
          <p className="text-gray-700">
            Time: <span className="font-medium">14:30</span>
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Rate
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Qty
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {foodData.map((food, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-6 py-4 text-gray-800">{food.item}</td>
                <td className="px-6 py-4 text-gray-800">{food.rate}</td>
                <td className="px-6 py-4 text-gray-800">{food.qty}</td>
                <td className="px-6 py-4 text-gray-800">{food.amount}</td>
              </tr>
            ))}
          </tbody>
          {/* Total Price Row */}
          <tfoot>
            <tr className="bg-gray-100">
              <td
                colSpan="3"
                className="px-6 py-4 text-right text-gray-800 font-semibold"
              >
                Total Price:
              </td>
              <td className="px-6 py-4 text-gray-800 font-semibold">
                {/* Convert values to numbers and calculate the total */}
                <p>0</p>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Feedback Section */}
      <div className="flex flex-col items-center mt-10">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Give your valuable feedback
        </h3>
        <Link to="/ratingpage">
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg py-2 px-8 shadow-md transition-transform transform hover:scale-105">
            Click Here
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Bill;
