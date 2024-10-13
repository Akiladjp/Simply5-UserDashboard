// import { Slide } from "react-slideshow-image";
// import "react-slideshow-image/dist/styles.css";
// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function Slider() {
//   const [bannerShow, setBannerShow] = useState([]);
//   const[loading,setLoading] = useState(false)
//   const API_URL = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/slider`);
//         if (res.data.offerBanner) {
//           setBannerShow(res.data.offerBanner);
//         } else {
//           setBannerShow([]);
//         }
//       } catch (err) {
//         console.error("Error fetching offers:", err);
//         setBannerShow([]);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="w-[380px] h-[200px] md:w-[700px] md:h-[400px] lg:w-[1000px] lg:h-auto mx-auto p-4 gap-x-4 ">
//       <Slide
//         duration={500}
//         transitionDuration={1000}
//         infinite={true}
//         indicators={true}
//         arrows={true}

//       >
//         {bannerShow.length > 0 ? (
//           bannerShow.map((data, index) => (
//             <div

//               className="relative w-full h-[150px] md:h-[300px] lg:h-[400px] overflow-hidden  shadow-lg"

//             >
//               <img
//                 src={data.image_url}
//                 alt={`banner-${data.offerID}`}
//                 className="w-[380px] h-[200px]  md:w-[1000px] md:h-[400px] object-cover bg-center  transition-transform duration-500"
//               />
//               {/* <div className="absolute bottom-4 left-4 bg-black bg-opacity-100 text-white p-2 rounded-md">
//               </div> */}
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-gray-500">No offer banners to display</p>
//         )}
//       </Slide>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react"; // Make sure React and hooks are imported
import axios from "axios"; // Ensure axios is imported
import AwesomeSlider from "react-awesome-slider";
import withAutoplay from "react-awesome-slider/dist/autoplay";
import "react-awesome-slider/dist/styles.css"; // Import the necessary CSS for the slider

export default function Slider() {
	const AutoplaySlider = withAutoplay(AwesomeSlider);

	const [bannerShow, setBannerShow] = useState([]);
	const [loading, setLoading] = useState(false);
	const API_URL = import.meta.env.VITE_API_URL;

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true); // Set loading to true while fetching
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
			} finally {
				setLoading(false); // Set loading to false after fetching
			}
		};

		fetchData();
	}, []);

	return (
		<>
			{loading ? (
				<p>Loading...</p>
			) : (
				<div className="w-full bg-red-400 md:h-[400px] h-[200px] flex justify-center m-auto items-center">
					<AutoplaySlider
						play={true}
						cancelOnInteraction={true} // Should stop playing on user interaction
						interval={8000}
						mobileTouch={true}
						organicArrows={false}
						bullets={false}
						className="w-full h-full" 
            startup={true}// Slider has full height
					>
						{bannerShow.map((data, index) => (
							<div key={index} className="w-full h-full">
								{/* Ensure the image fully covers the parent container */}
								<img
									src={data.image_url}
									alt={`Slide ${index + 1}`}
									className="w-full h-full object-cover"
								/>
							</div>
						))}
					</AutoplaySlider>
				</div>
			)}
		</>
	);
}
