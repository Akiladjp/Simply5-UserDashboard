import axios from "axios";
import { useState } from "react";

export default function Testimage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    console.log(image);

    try {
      const response = await axios.post(
        `${API_URL}/itemcards`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.message == "Successfully uploaded") {
        alert("Image uploaded successfully.");
      } else {
        alert("Image upload failed.");
      }
    } catch (error) {
      console.error("catch Error uploading image:", error);
      alert("An error occurred while uploading the image.");
    }
  };
  return (
    <div>
      {" "}
      <form
        encType="multipart/form-data"
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-4"
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-lg file:bg-gray-50 file:text-gray-700 file:cursor-pointer hover:file:bg-gray-100"
        />
        {preview && (
          <img
            src={preview}
            alt="Image preview"
            className="object-cover w-48 h-48 rounded-lg shadow-md"
          />
        )}
        <button
          type="submit"
          className="px-6 py-2 text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Upload Image
        </button>
      </form>
    </div>
  );
}
