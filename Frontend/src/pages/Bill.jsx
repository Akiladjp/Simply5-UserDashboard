import  { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMainpageState } from "../Redux/Slices/MainPageSilce";
import { Link } from "react-router-dom";

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

  return (
    <div className="items-center lg:w-[70%] h-screen lg:justify-start lg:mt-12 lg:m-auto lg:items-center lg:flex lg:flex-col p-2">
      <div className="my-2 ">
        <h1 className="text-[24px] uppercase flex justify-center">
          roseluxury hotel
        </h1>
        <h3 className="flex justify-center">hotline : 021 55 55 222</h3>
      </div>
      <div className="flex w-full mx-[2%] my-2 justify-between gap-8  lg:w-[90%] m-auto">
        <div className="flex  w-[40%]  items-center h-auto justify-start">
          <p>B. No : </p>
        </div>
        <div className="flex flex-col items-center w-[60%]">
          <p>Data: </p>
          <p>Time: </p>
        </div>
      </div>
      <div className="container p-4 mx-auto">
        <table className="w-full border-separate table-auto border-spacing-y-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border-y">Item</th>
              <th className="px-4 py-2 border-y">Rate</th>
              <th className="px-4 py-2 border-y">Qty</th>
              <th className="px-4 py-2 border-y">Amount</th>
            </tr>
          </thead>
          <tbody>
            {foodData.map((food, index) => (
              <tr key={index} className="bg-white">
                <td className="px-4 py-2 border-y">{food.item}</td>
                <td className="px-4 py-2 border-y">{food.rate}</td>
                <td className="px-4 py-2 border-y">{food.qty}</td>
                <td className="px-4 py-2 border-y">{food.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col">
        <h3 className="flex justify-center font-semibold">
          Give your valueble feedback us
        </h3>
        <Link to="/ratingpage">
          <button className="flex justify-center mx-auto bg-red-700 w-[100px] rounded-md py-1 my-4 text-white">
            Click here
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Bill;
