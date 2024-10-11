import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Slider() {
  const [bannerShow, setBannerShow] = useState([]);
  const[loading,setLoading] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/slider`);
        if (res.data.offerBanner) {
          setBannerShow(res.data.offerBanner);
        } else {
          setBannerShow([]);
        }
      } catch (err) {
        console.error("Error fetching offers:", err);
        setBannerShow([]);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-[380px] h-[200px] md:w-[700px] md:h-[400px] lg:w-[1000px] lg:h-auto mx-auto p-4 gap-x-4 ">
      <Slide
        duration={500}
        transitionDuration={1000}
        infinite={true}
        indicators={true}
        arrows={true}
    
      >
        {bannerShow.length > 0 ? (
          bannerShow.map((data, index) => (
            <div

              className="relative w-full h-[150px] md:h-[300px] lg:h-[400px] overflow-hidden  shadow-lg"

            >
              <img
                src={data.image_url}
                alt={`banner-${data.offerID}`}
                className="w-[380px] h-[200px]  md:w-[1000px] md:h-[400px] object-cover bg-center  transition-transform duration-500"
              />
              {/* <div className="absolute bottom-4 left-4 bg-black bg-opacity-100 text-white p-2 rounded-md">
              </div> */}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No offer banners to display</p>
        )}
      </Slide>
    </div>
  );
}
