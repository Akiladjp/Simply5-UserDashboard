import axios from "axios";
import { useEffect, useState } from "react";
import { useFetcher, useNavigate } from "react-router-dom";

export default function CategoryCart() {
	const API_URL = import.meta.env.VITE_API_URL;
const navigate= useNavigate()
	const [subCategotyValues, setSubCategoryValues] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get(`${API_URL}/subcategory`);
				if (response.data && response.data.subCategories) {
					
					setSubCategoryValues(response.data.subCategories);
			
				} else {
					console.log("error");
				}
			} catch (err) {
				console.log("error in axios", err);
			}
		};

		fetchData();
		console.log(subCategotyValues);
	}, []);

	return (
		<div className=" grid grid-cols-3 gap-2 justify-items-center px-2 py-2 lg:gap-8 w-full ">
			{subCategotyValues.map((category, index) => (
				<div
				onClick={()=>{navigate(`/subcategoryitem/${encodeURIComponent(category.name)}`)}}
					key={index}
					className="relative w-[110px] h-auto flex flex-col items-center  justify-center ">
					<div className=" overflow-hidden rounded-full  w-24 h-24 lg:w-32 lg:h-32 object-contain bg-red-600 bg-center flex justify-center">
						<img
							src={`${category.image_url}`}
							alt={`${category.name}'image`}
							// Added to ensure the image covers its container
							className="object-cover w-full"
						/>
					</div>
					<div className="w-full p-1 text-center">
						<p className="mt-0 text-base">{category.name}</p>
					</div>
				</div>
			))}
		</div>
	);
}
