import React from "react";
import { useNavigate } from "react-router-dom";

//Componente del icono del panteon que lleva a /home
const HomeButton = () => {
	const navigate = useNavigate();

	const handleButtonClick = () => {
		navigate("/");
	};

	return (
		<div>
			
			<p className="font-bold cursor-pointer w-fit" onClick={handleButtonClick}>
				Home
			</p>
		</div>
	);
};

export default HomeButton;