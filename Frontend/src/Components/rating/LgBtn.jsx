import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Redux/Slices/AuthSlice";
import { useDispatch } from "react-redux";

export const LgBtn = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Fix here

  const handleDelete = () => {
    dispatch(logout());
    axios
      .get(`${API_URL}/logout`)
      .then((res) => {
        navigate('/login');
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div className="flex justify-center my-8">
        <button
          className="bg-red-700 text-white text-[20px] uppercase font-bold rounded-xl px-6 py-2 shadow-md active:scale-95"
          onClick={() => {
            handleDelete();
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
};
