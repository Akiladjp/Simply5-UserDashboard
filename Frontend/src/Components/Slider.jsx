import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Slider() {
  const [bannerShow, setBannerShow] = useState([]);
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
    <div className="w-[1000px] h-[600px] mx-auto p-4">
      <Slide
        duration={5000}
        transitionDuration={1000}
        infinite={true}
        indicators={true}
        arrows={false}
      >
        {bannerShow.length > 0 ? (
          bannerShow.map((data, index) => (
            <div
              key={index}
              className="relative w-full h-[400px] overflow-hidden rounded-lg shadow-lg bg-red-400"
            >
              <img
                src={data.image_url}
                alt={`banner-${data.offerID}`}
                className="w-full h-full  md:w-[1000px] md:h-[400px] object-cover bg-center rounded-lg transition-transform duration-500"
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
