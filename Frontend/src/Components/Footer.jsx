import Logo from "../assets/Images/logo.png";
import Payment from "../assets/Images/payment.png";
import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { IoLogoWhatsapp } from "react-icons/io";

export default function Footer() {
  return (

    <div className="flex p-1">
      
    <div className="bg-[#212121] md:w-[768px] h-auto pb-4 mx-auto w-full p-2">
      <div className="">
        <img className="w-32 mx-auto md:w-40" src={Logo} alt="" />
      </div>
      <div className="ml-4 text-white md:ml-8">
        <div className="text-[10px] flex mt-4 gap-8 md:gap-32 md:text-[14px] md:mt-6">
          <div className="">
            <div>Address:</div>
            <div className="mt-1">Jaffna, Srilanka</div>
          </div>
          <div>
            <div>Telephone:</div>
            <div className="mt-[5px]">077 77 77 777</div>
          </div>
          <div>
            <div>Email:</div>
            <div className="mt-1">simply5restaurant@gmail.com</div>
          </div>
        </div>
      </div>

      <div className="flex mt-10 md:mt-12">
        <div className="flex w-full">
          <img
            className="w-32 mt-1 ml-4 md:ml-8 md:w-40 h-7"
            src={Payment}
            alt=""
          />
        </div>
        <div className="flex justify-end gap-3 mr-3 md:mr-16 md:gap-4">
          <div className="text-white text-[28px] md:text-[30px]">
            {" "}
            <FaFacebook />{" "}
          </div>
          <div className="text-white text-[30px] md:text-[32px]">
            {" "}
            <RiInstagramFill />{" "}
          </div>
          <div className="text-white text-[30px] md:text-[32px]">
            {" "}
            <IoLogoWhatsapp />{" "}
          </div>
        </div>
      </div>
      <div className="text-gray-400 flex mt-4 text-[8px] justify-center">Roseluxury 2024 Design by Simply5 pvt lmt.</div>

    </div>
    </div>
  );
}
