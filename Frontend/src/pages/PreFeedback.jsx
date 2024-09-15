import React from "react";
import { Link } from "react-router-dom";

function PreFeedback() {
	return (
		<div>
			<Link to="/" className="w-40 h-16 px-4 py-2 bg-orange-500 flex items-center justify-center m-auto top-20 absolute left-[50%] rounded-lg">SKIP</Link>
		</div>
	);
}

export default PreFeedback;
