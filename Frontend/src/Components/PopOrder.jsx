import { useEffect, useState } from "react";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { setButtonState } from "../Redux/Slices/AddbuttonSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectItemID } from "../Redux/Slices/ItemIdSlider";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { selectMobileno } from "../Redux/Slices/AuthSlice";
import { selectaddCount } from "../Redux/Slices/AddbuttonCountSlice";

const PopOrder = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const [isalready, setIsalready] = useState(false);
  const mobileno = useSelector(selectMobileno);
  const [popItems, setpopItems] = useState([]);
  const [loading, setloading] = useState(true);
  const addcount = useSelector(selectaddCount);
  const [count, setCount] = useState(1);
 
  const getitemID = useSelector(selectItemID);
  const [preValue, setPreValues] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [addCartValue, setaddCartValues] = useState({
    mobileno: "",
    itemID: "",
    quantity: 0,
  });

  useEffect(() => {
    if (!isalready) {
      console.log("not already");
      setaddCartValues({
        mobileno: mobileno,
        itemID: getitemID,
        quantity: count,
      });
    } else if (preValue.length > 0) {
      console.log("in effect already", preValue[0].quantity);
      setCount(preValue[0].quantity);
    }
    
  }, [addcount, isalready, mobileno, getitemID, count, preValue]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/getpopitems?itemid=${getitemID}`
        );
        if (response && response.data) {
          setpopItems(response.data.popItem[0] || []);
        } else if (response.data.message === "err") {
          console.log(response.data.message);
        }
      } catch (err) {
        console.error("err", err);
      }
    };

    fetchData();
  }, [addcount, getitemID, API_URL]);

  const handleLoad = () => {
    setloading(false);
  };

  const updateCansel = () => {
    dispatch(setButtonState(false));
    setIsloading(false); // Reset isLoading to false
    setpopItems([]);
    setIsalready(false);  // Reset isalready to initial value
    setloading(true); // Reset loading state to show spinner
  };

  const updatebuttonstate = () => {
    dispatch(setButtonState(false));
  };
 const plus = () => {
  setCount(prevCount => {
    const newCount = prevCount + 1;
    setPreValues(prevState => ({
      ...prevState,
      quantity: newCount,
    }));
    return newCount;
  });
};

 const minus = () => {
  setCount(prevCount => {
    if (prevCount > 1) {
      const newCount = prevCount - 1;
      setPreValues(prevState => ({
        ...prevState,
        quantity: newCount,
      }));
      return newCount;
    }
    return prevCount;
  }
);
};
  useEffect(() => {
    const fetchItemQuantity = async () => {
      if (getitemID) {
        try {
          const response = await axios.get(
            `${API_URL}/get_qaun_item?mobileno=${mobileno}&itemID=${getitemID}`
          );
          if (response && response.data) {
            if (response.data.message === "error") {
              console.log(response.data.message);
            } else if (response.data.message === "already") {
              setPreValues(response.data.result);
              console.log(response.data.result);
              setIsalready(true);
              setTimeout(() => {
                setIsloading(true); // Show content after delay
              }, 500);
            }
            else{
              setCount(1);
              setTimeout(() => {
                setIsloading(true); // Show content after delay
              }, 500);
            }
          }
        } catch (err) {
          console.log("Error in getting quantity from database: ", err);
        }
      }
    };

    fetchItemQuantity();
  }, [addcount, getitemID, mobileno, API_URL]);

  const add_Cart_data = async (itemid, qua) => {
    const addCartValue = {
      mobileno,
      itemID: itemid,
      quantity: qua,
    };

    try {
      const response = await axios.post(`${API_URL}/add_cart`, addCartValue);
      if (response && response.data) {
        if (response.data.message === "Error in adding data to add_cart") {
          console.log(response.data.message);
        } else {
          console.log("Item added to cart successfully");
        }
      }
    } catch (err) {
      console.log("Error adding to cart: ", err);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="absolute top-0 bottom-0 z-10 flex items-center justify-center w-full m-auto overflow-hidden">
          <div className="flex items-center scale-110 bg-white shadow-xl">
            <div className="w-[250px] h-[470px] rounded-lg shadow-md">
              <div>
                <img
                  className="w-[250px] h-[250px]"
                  src={popItems.image_url}
                  alt="item-image"
                  onLoad={handleLoad}
                />
              </div>
              <div className="mx-[33px] mt-2">
                <div>
                  <h2 className="font-bold text-[20px]">{popItems.name}</h2>
                </div>
                <div className="flex items-center w-full gap-6 mt-2">
                  <div className="flex items-end justify-end gap-1">
                    <i className="text-green-700">
                      <AccessAlarmsIcon fontSize="small" />
                    </i>
                    <p className="text-sm text-green-700">
                      {popItems.prepare_time}
                    </p>
                  </div>
                  <div className="flex items-end justify-center gap-1">
                    <i className="text-red-700">
                      <StarOutlineIcon fontSize="small" />
                    </i>
                    <p className="text-sm text-red-700">{popItems.rate}</p>
                  </div>
                </div>
                <div>
                  <p className="w-[184px] mt-4 text-[9px] text-gray-500">
                    {popItems.description}
                  </p>
                </div>

                <div className="flex mt-[15px] mb-[18px]">
                  <div className="flex w-[80px] space-x-4 border-[2px] rounded-3xl">
                    <button
                      className="ml-[5px]"
                      onClick={minus}
                      disabled={count === 1}
                    >
                      {" "}
                      -{" "}
                    </button>
                    <p>{count}</p>
                    <button onClick={plus}> +{""}</button>
                  </div>

                  <div className="ml-[24px] flex">
                    <p>Rs:</p>
                    <p>{count * (popItems.price || 0)}</p>
                    <p>.00</p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={updateCansel}
                    className="uppercase shadow-sm w-[80px] py-2 rounded-md bg-red-600 text-white font-bold text-[10px]"
                  >
                    cancel
                  </button>

                  <button
                    onClick={async () => {
                      updatebuttonstate();
                      await add_Cart_data(popItems.itemID, count);
                    }}
                    className="uppercase shadow-sm w-[80px] py-1 rounded-md bg-green-600 text-white font-bold text-[10px]"
                  >
                    add cart
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>
      ) : (
        <ClipLoader size={60} color={"#000"} loading={loading} />
      )}
    </>
  );
};

export default PopOrder;
