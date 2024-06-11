import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";

const Results = () => {
	const navigate = useNavigate();
	const [info, setInfo] = useState(null); // Aquí se guardará la información del localStorage
	const [selectedProducts, setSelectedProducts] = useState([]);

	useEffect(() => {
		// Obtener los resultados del localStorage
		const data = localStorage.getItem("scrapingResults");
		if (data) {
			const parsedData = JSON.parse(data);
			setInfo(parsedData);
			setSelectedProducts(parsedData.response.map((product) => product.results[0].products));
		}
	}, []);

	const handleSelectProduct = (productIndex, storeIndex, columnIndex) => {
		const newSelectedProducts = [...selectedProducts];
		const tempProduct = newSelectedProducts[productIndex][columnIndex];
		newSelectedProducts[productIndex][columnIndex] =
			info.response[productIndex].results[storeIndex].products[columnIndex];
		info.response[productIndex].results[storeIndex].products[columnIndex] = tempProduct;
		setSelectedProducts(newSelectedProducts);
	};

	const getLowestPriceIndex = (products) => {
		let lowestPriceIndex = 0;
		for (let i = 1; i < products.length; i++) {
			if (products[i].priceDiscounted < products[lowestPriceIndex].priceDiscounted) {
				lowestPriceIndex = i;
			}
		}
		return lowestPriceIndex;
	};

	const calculateTotal = (storeIndex) => {
		return selectedProducts.reduce(
			(total, product) => total + product[storeIndex].priceDiscounted,
			0
		);
	};

	if (!info) {
		return <div>Loading...</div>; // Muestra un mensaje de carga mientras se obtiene la información
	}

	return (
		<div className="container mx-auto p-4 lg:px-44 font-text">
			<div className="flex justify-between mt-4">
				<button className="flex items-center justify-center" onClick={() => navigate("/")}>
					<img src="/images/logo.png" alt="Seleccionar" className="h-16 w-26" />
				</button>
				<Link to="/login">
					<FaUser className="w-6 h-6" />
				</Link>
			</div>
			<h1 className="text-2xl font-[750] mt-12 mb-16 text-[#e29500]">
				Encontramos los siguientes productos de acuerdo a tus necesidades
			</h1>
			<div className="flex justify-evenly gap-16">
				<div
					className="image-box w-24 h-24 sm:w-40 sm:h-40 bg-center bg-cover rounded-3xl shadow-lg"
					style={{ backgroundImage: "url(/images/images.png)" }}
				>
					<div className="image-name hidden">Exito</div>
				</div>
				<div
					className="image-box w-24 h-24 sm:w-40 sm:h-40 bg-center bg-cover rounded-3xl shadow-lg"
					style={{ backgroundImage: "url(/images/jumbo2.jpg)" }}
				>
					<div className="image-name hidden">Jumbo</div>
				</div>
				<div
					className="image-box w-24 h-24 sm:w-40 sm:h-40 bg-center bg-cover rounded-3xl shadow-lg"
					style={{ backgroundImage: "url(/images/Olimpical.png)" }}
				>
					<div className="image-name hidden">Olimpica</div>
				</div>
			</div>

			{info.response.map((product, productIndex) => {
				const lowestPriceIndex = getLowestPriceIndex(selectedProducts[productIndex]);

				return (
					<div key={productIndex} className="mb-8">
						<h2 className="text-3xl font-bold my-12 ">{product.productName}</h2>
						<div className="grid grid-cols-3 gap-4 mb-4 border border-[#e29500] rounded-2xl p-8">
							{selectedProducts[productIndex].map((item, index) => {
								const discountPercentage = item.priceWithoutDiscount
									? Math.round(
											((item.priceWithoutDiscount - item.priceDiscounted) /
												item.priceWithoutDiscount) *
												100
									  )
									: null;
								return (
									<div key={index} className="text-center">
										<div className="flex justify-center">
											<div>
												<a
													href={item.productLink || item.link}
													target="_blank"
													rel="noopener noreferrer"
												>
													<img
														src={item.imageUrl || item.imgSrc}
														alt={item.name}
														className="h-24 mx-auto mb-2"
													/>
												</a>
												<a
													href={item.productLink || item.link}
													target="_blank"
													rel="noopener noreferrer"
													className="no-underline text-black"
												>
													{item.name}
												</a>
												<div
													className={`font-bold ${
														index === lowestPriceIndex ? "text-green-700" : ""
													} ${index === lowestPriceIndex ? "text-lg" : "text-base"}`}
												>
													${item.priceDiscounted}{" "}
													{discountPercentage !== null && (
														<span className="text-gray-500">(-{discountPercentage}%)</span>
													)}
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>

						<h3 className="text-lg font-semibold my-12">Otros Productos Similares</h3>
						{info.response[productIndex].results.slice(1).map((result, storeIndex) => (
							<div key={storeIndex + 1}>
								<div className="grid grid-cols-3 gap-4 mb-4">
									{result.products.map((item, columnIndex) => {
										const discountPercentage = item.priceWithoutDiscount
											? Math.round(
													((item.priceWithoutDiscount - item.priceDiscounted) /
														item.priceWithoutDiscount) *
														100
											  )
											: null;
										return (
											<div className="flex items-center justify-center mb-4" key={columnIndex}>
												<div className="flex flex-col gap-2">
													<button
														className="flex items-center justify-center"
														onClick={() =>
															handleSelectProduct(productIndex, storeIndex + 1, columnIndex)
														}
													>
														<img src="/images/check.png" alt="Seleccionar" className="h-6 w-6" />
													</button>
												</div>
												<div className="flex flex-col items-center w-48">
													<a
														href={item.productLink || item.link}
														target="_blank"
														rel="noopener noreferrer"
														className="no-underline text-black"
													>
														{item.name}
													</a>
													<div className="font-bold">
														${item.priceDiscounted}{" "}
														{discountPercentage !== null && (
															<span className="text-gray-500">(-{discountPercentage}%)</span>
														)}
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						))}
					</div>
				);
			})}

			<div className="mt-8">
				<h2 className="text-2xl font-[750] text-[#e29500] mb-4">Total a pagar</h2>
				<div className="grid grid-cols-3 gap-4">
					<div className="flex flex-col justify-center items-center">
						<div
							className={`image-box sm:w-28 sm:h-28 bg-center bg-cover rounded-3xl shadow-lg ${
								calculateTotal(0) ===
								Math.min(calculateTotal(0), calculateTotal(1), calculateTotal(2))
									? "border-green-500"
									: ""
							}`}
							style={{ backgroundImage: "url(/images/images.png)" }}
						>
							<div className="image-name hidden">Exito</div>
						</div>
						<div
							className={`font-bold my-4 ${
								calculateTotal(0) ===
								Math.min(calculateTotal(0), calculateTotal(1), calculateTotal(2))
									? "text-green-700 text-xl"
									: "text-base"
							}`}
						>
							${calculateTotal(0)}
						</div>
					</div>
					<div className="flex flex-col justify-center items-center">
						<div
							className={`image-box sm:w-28 sm:h-28 bg-center bg-cover rounded-3xl shadow-lg ${
								calculateTotal(2) ===
								Math.min(calculateTotal(0), calculateTotal(1), calculateTotal(2))
									? "border-green-500"
									: ""
							}`}
							style={{ backgroundImage: "url(/images/jumbo2.jpg)" }}
						>
							<div className="image-name hidden">Jumbo</div>
						</div>
						<div
							className={`font-bold my-4 ${
								calculateTotal(1) ===
								Math.min(calculateTotal(0), calculateTotal(1), calculateTotal(2))
									? "text-green-700 text-xl"
									: "text-base"
							}`}
						>
							${calculateTotal(1)}
						</div>
					</div>
					<div className="flex flex-col justify-center items-center">
						<div
							className={`image-box sm:w-28 sm:h-28 bg-center bg-cover rounded-3xl shadow-lg ${
								calculateTotal(1) ===
								Math.min(calculateTotal(0), calculateTotal(1), calculateTotal(2))
									? "border-green-500"
									: ""
							}`}
							style={{ backgroundImage: "url(/images/Olimpical.png)" }}
						>
							<div className="image-name hidden">Olimpica</div>
						</div>
						<div
							className={`font-bold my-4 ${
								calculateTotal(2) ===
								Math.min(calculateTotal(0), calculateTotal(1), calculateTotal(2))
									? "text-green-700 text-xl"
									: "text-base"
							}`}
						>
							${calculateTotal(2)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Results;
