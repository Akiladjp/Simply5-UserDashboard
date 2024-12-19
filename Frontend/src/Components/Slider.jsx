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
