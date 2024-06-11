import React, { useState, useRef ,useEffect} from "react";
import { FaEdit, FaTrash, FaMicrophone, FaStopCircle, FaUser } from "react-icons/fa";
import { Link, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


function Search() {
	const [search, setSearch] = useState("");
	const [edit, setEdit] = useState(false);
	const [estadoEdit, setEstadoEdit] = useState("Edit");
	const [editIndex, setEditIndex] = useState(null);
	const [editValue, setEditValue] = useState("");
	const [lista, setLista] = useState([]);
	const [listaScrapping, setlistaScrapping] = useState([]);
	const [isRecording, setIsRecording] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [audioUrl, setAudioUrl] = useState(null);
	const [error, setError] = useState(null);
	const mediaRecorderRef = useRef(null);
	const audioChunksRef = useRef([]);
	const [loading, setLoading] = useState(false);
	const [loading2, setLoading2] = useState(false);

	const [isAnalyzed, setIsAnalyzed] = useState(false);
	const [isAnalyzedBusqueda, setIsAnalyzedBusqueda] = useState(false);

	const navigate = useNavigate(); 

	const API_URL = "https://smartbuyerbackend-production.up.railway.app";

	const handleSubmitOpenIA = async (event) => {
		event.preventDefault();


		if (!search.trim()) {
			Swal.fire({
				icon: "warning",
				title: "Campo vacío",
				text: "Debe ingresar su mercado",
			});
			return;
		}

		setLoading(true);
		
		try {
			const response = await fetch(`${API_URL}/gpt_create_products_list`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					inputText: search,
				}),
			});

			if (response.ok) {
				setIsAnalyzed(true)
				const formattedList = await response.json();
				if (formattedList.lines && formattedList.lines.length > 0) {
					console.log(formattedList);
					setLista(formattedList.lines);
					
				} else {
					Swal.fire({
						icon: "error",
						title: "Sin resultados",
						text: 'No se encontraron productos. Asegúrese de haber ingresado un producto válido. Por ejemplo: "Azúcar blanca 2.5kg, Café Aguila Roja 500 gramos, Leche bolsa 6 unidades 1 ml Alpina...".',
					});
				}
				setLoading(false);
			} else {
				console.error("Error en la petición:", response.statusText);
				Swal.fire({
					icon: "error",
					title: "Error en la petición",
					text: `Hubo un problema con la solicitud: ${response.statusText}`,
				});
				setLoading(false);
			}
		} catch (error) {
			console.error("Error al realizar la petición:", error);
			Swal.fire({
				icon: "error",
				title: "Error al realizar la petición",
				text: "Hubo un problema al realizar la solicitud. Por favor, inténtelo de nuevo.",
			});
			setLoading(false);
		}
	};

	const handleSubmitOpenGpt = async (event) => {
		setLoading2(true);
		event.preventDefault();
		setLoading(true);
		// Convertir el array en un string separado por comas
		let stringResultado = lista.join(", ");
		console.log("esta es la lista ", stringResultado);
		try {
			const response = await fetch(`${API_URL}/gpt_confirm_products_list`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					inputText: stringResultado,
				}),
			});

			if (response.ok) {
				setIsAnalyzed(true);
				const formattedList = await response.json();
				console.log("esta es la 98 ", formattedList);
	
				webScrapping(formattedList.formattedData);
				setLoading(false);
			} else {
				console.error("Error en la petición:", response.statusText);
			}
		} catch (error) {
			console.error("Error al realizar la petición:", error);
		}
	};

	const webScrapping = async (datos) => {
		
		console.log("estos son los datos ", datos);
		const data = JSON.parse(datos);
		console.log("Iniciando web scraping ", data);

		try {
			const response = await fetch(`${API_URL}/scraping`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const responseData = await response.json();
			console.log("Respuesta del servidor:", responseData);
			setlistaScrapping(responseData.response[0].results);
			console.log(listaScrapping);
			// Guardar la respuesta en localStorage
			localStorage.setItem("scrapingResults", JSON.stringify(responseData));

			// Navegar a la página de resultados
			navigate('/results');
		} catch (error) {
			console.error("Error al hacer la solicitud:", error);
		}
	};
	useEffect(() => {
        console.log("Estado actualizado de listaScrapping:", listaScrapping);
		if (listaScrapping.length > 0) {
			localStorage.setItem("productos", JSON.stringify(listaScrapping));
        navigate('/results');
    }
    }, [listaScrapping]);
	
	const handleStartRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);

			mediaRecorderRef.current = mediaRecorder;

			mediaRecorder.ondataavailable = (event) => {
				audioChunksRef.current.push(event.data);
			};

			mediaRecorder.onstop = async () => {
				const audioBlob = new Blob(audioChunksRef.current, { type: "audio/ogg" });
				const audioUrl = URL.createObjectURL(audioBlob);
				setAudioUrl(audioUrl);
				audioChunksRef.current = [];
				setIsProcessing(true);
				await sendAudioToServer(audioBlob);
				setIsProcessing(false);
			};

			mediaRecorder.start();
			setIsRecording(true);
			setError(null); // Limpiar cualquier error previo
		} catch (error) {
			console.error("Error accessing microphone", error);
			setError(
				"No se pudo acceder al micrófono. Por favor, otorga permisos para usar el micrófono."
			);
		}
	};

	const handleStopRecording = () => {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
		}
	};

	const sendAudioToServer = async (audioBlob) => {
		try {
			const formData = new FormData();
			formData.append("audio", audioBlob, "recording.ogg");

			const response = await fetch(`${API_URL}/transcribes`, {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Error al enviar el audio al servidor");
			}

			const data = await response.json();
			console.log("Respuesta del servidor:", data);
			setSearch(data.transcripcion);
		} catch (error) {
			console.error("Error al enviar el audio", error);
			setError("Error al enviar el audio al servidor");
		}
	};

	const handleInputChange = (e) => {
		setSearch(e.target.value);
	};

	const handleEdit = (index, texto) => {
		if (!edit) {
			// Entrando al modo de edición
			setEditIndex(index);
			setEditValue(texto); // Establecer el valor actual del elemento en el estado de edición
			setEdit(true);
			setEstadoEdit("Save");
		} else {
			// Saliendo del modo de edición
			const nuevaLista = [...lista];
			nuevaLista[index] = editValue; // Guardar el valor editado en la lista
			setLista(nuevaLista);
			setEditIndex(null);
			setEditValue(""); // Limpiar el valor de edición
			setEdit(false);
			setEstadoEdit("Edit");
		}
	};

	const handleDelete = (index) => {
		const nuevaLista = [...lista];
		nuevaLista.splice(index, 1);
		setLista(nuevaLista);
	};
	const halfScreenWidth = "50vw";
	return (
		<div>
			<div className="flex justify-between mt-8 mr-8">
				<div></div>
				<Link to="/login">
					<FaUser className="w-6 h-6 mr-4" />
				</Link>
			</div>
			<div className="font-text flex flex-col items-center justify-center text-center p-4">
				<header className="flex flex-col items-center justify-center w-full max-w-lg">
					<img src="/images/logo.png" className="mt-10 w-60 md:w-80" alt="logo" />

					{/* CUADRO DE BUSQUEDA */}
					<div className="relative mt-8 w-full">
						<p className="text-xl">Escribe tu lista de compras</p>
						<textarea
							value={search}
							className="form-control resize-none w-full h-56 mt-4 border border-[#e29500] bg-zinc-200 p-2 pr-6 text-lg rounded-lg"
							onChange={handleInputChange}
							placeholder="Azúcar blanca 2.5kg, Café Aguila Roja 500 gramos, Leche bolsa 6 unidades 1 ml Alpina..."
						/>
						<div
							onClick={isRecording ? handleStopRecording : handleStartRecording}
							className="absolute right-4  transform -translate-y-1/2 cursor-pointer"
						>
							{isRecording ? (
								<FaStopCircle className="text-xl mb-12 sm:text-2xl text-red-500" />
							) : (
								<FaMicrophone className="text-xl mb-12 sm:text-2xl" />
							)}
						</div>
						{error && <p className="text-red-500 mt-2">{error}</p>}
					</div>

					{isProcessing && (
						<div
							style={{
								position: "fixed",
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								backgroundColor: "rgba(255, 255, 255, 0.8)",
								padding: `calc(${halfScreenWidth} / 6)`,
								borderRadius: "10px",
								boxShadow: "0 0 100px rgba(0, 0, 0, 0.2)",
								fontSize: "24px",
							}}
						>
							<div className="flex flex-col items-center">
								<svg
									className="animate-spin h-8 w-8 text-gray-600 mb-4"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								<p>Se está procesando la grabación...</p>
							</div>
						</div>
					)}

					<button
						className=" mt-4 bg-[#e29500] hover:bg-[#cb8600] text-white text-xl rounded-lg w-fit px-4 h-10"
						onClick={(event) => handleSubmitOpenIA(event)} // Invocar la función dentro de una función anónima
						type="submit"
					>
						Analizar compras
					</button>
					{loading && (
						<div
							style={{
								position: "fixed",
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								backgroundColor: "rgba(255, 255, 255, 0.8)",
								padding: `calc(${halfScreenWidth} / 6)`,
								borderRadius: "10px",
								boxShadow: "0 0 100px rgba(0, 0, 0, 0.2)",
								fontSize: "24px",
							}}
						>
							<img src="/images/logo.png" className="mt-10 w-40 sm:w-60 md:w-80" alt="logo" />
							<p style={{ margin: 0 }}>Evaluando tu lista de mercado...</p>
						</div>
					)}
										{loading2 && (
						<div
							style={{
								position: "fixed",
								top: "50%",
								left: "50%",
								transform: "translate(-50%, -50%)",
								backgroundColor: "rgba(255, 255, 255, 0.8)",
								padding: `calc(${halfScreenWidth} / 6)`,
								borderRadius: "10px",
								boxShadow: "0 0 100px rgba(0, 0, 0, 0.2)",
								fontSize: "24px",
							}}
						>
						<img src="/images/logo.png" className="mt-10 w-40 sm:w-60 md:w-80" alt="logo" />

							<img src="/images/carga.gif" className="mt-10 w-40 sm:w-60 md:w-80" alt="logo" />
							<p style={{ margin: 0 }}>Procesando tu lista de mercado...</p>
						</div>
					)}
					<p className="text-lg sm:text-xl mt-4">Tu lista actualmente se ve así:</p>
						{isAnalyzed && (
                lista.map((texto, index) => (
                    <div key={index} className="flex items-center mt-4 w-full">
                        <input
                            type="text"
                            className="form-list w-full h-10 border border-orange-600 bg-zinc-200 text-lg sm:text-xl text-center rounded-lg"
                            value={editIndex === index ? editValue : texto}
                            readOnly={editIndex !== index}
                            onChange={(e) => setEditValue(e.target.value)}
                        />
                        <FaEdit
                            className="text-lg sm:text-xl ml-2 sm:ml-4 cursor-pointer"
                            onClick={() => handleEdit(index, texto)}
                            aria-label={estadoEdit}
                        />
                        <FaTrash
                            className="text-lg sm:text-xl ml-2 sm:ml-4 cursor-pointer"
                            onClick={() => handleDelete(index)}
                            aria-label="Delete"
                            data-testid="delete-icon"
                        />
                    </div>
                ))
            )}
					<button
						className=" boton mt-4 bg-[#e29500] hover:bg-[#cb8600] text-white text-xl rounded-lg w-fit px-4 h-10"
						type="submit"
						onClick={(event) => handleSubmitOpenGpt(event)}
					>
						Buscar
					</button>
				</header>

				{/* FOOTER */}
				<h2 className="text-xl sm:text-2xl font-normal mt-8">
					Tu lista será cotizada automáticamente en:
				</h2>
				<div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-8">
					<div
						className="image-box w-24 h-24 sm:w-40 sm:h-40 bg-center bg-cover rounded-3xl shadow-lg"
						style={{ backgroundImage: "url(/images/images.png)" }}
					>
						<div className="image-name hidden">Exito</div>
					</div>
					<div
						className="image-box w-24 h-24 sm:w-40 sm:h-40 bg-center bg-cover rounded-3xl shadow-lg"
						style={{ backgroundImage: "url(/images/D1.jpg)" }}
					>
						<div className="image-name hidden">D1</div>
					</div>
					<div
						className="image-box w-24 h-24 sm:w-40 sm:h-40 bg-center bg-cover rounded-3xl shadow-lg"
						style={{ backgroundImage: "url(/images/jumbo.jpg)" }}
					>
						<div className="image-name hidden">Jumbo</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Search;
