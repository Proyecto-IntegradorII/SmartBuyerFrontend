import React, { useEffect, useState, useRef } from "react";
import { FaEdit, FaTrash, FaMicrophone, FaStopCircle, FaUser } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Swal from "sweetalert2";
import { postQuery, getQueries, getQuery } from "../conections/requests";
function Search() {
	const [search, setSearch] = useState("");
	const [edit, setEdit] = useState(false);
	const [estadoEdit, setEstadoEdit] = useState("Edit");
	const [editIndex, setEditIndex] = useState(null);
	const [editValue, setEditValue] = useState("");
	const [lista, setLista] = useState(["carne", "pollo"]);
	const [isRecording, setIsRecording] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [audioUrl, setAudioUrl] = useState(null);
	const [error, setError] = useState(null);
	const mediaRecorderRef = useRef(null);
	const audioChunksRef = useRef([]);
	const [response2, setResponse2] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selectedValue, setSelectedValue] = useState("");
	const [titles, setTitles] = useState([]);

	// Función para hacer la solicitud a la API
	const fetchUserQueries = async () => {
		try {
			const user_id_saved_in_local_storage = localStorage.getItem("user_id")
			const data = await getQueries(user_id_saved_in_local_storage);

			// Extraer los títulos de la respuesta
			const titles = data.map(query => query.title);

			// Actualizar el estado con los títulos
			setTitles(titles);


		} catch (error) {
			console.error('Error fetching user queries:', error);
			Swal.fire(`No se pudo obtener tus búsquedas`);
		}
	};

	useEffect(() => {
		// Llamar a la función de solicitud
		fetchUserQueries();
	}, []);

	const handleChange = (event) => {
		setSelectedValue(event.target.value);

		// Función para hacer la solicitud a la API
		const fetchUserQuery = async () => {
			try {
				const user_id_saved_in_local_storage = localStorage.getItem("user_id")
				const data = await getQuery(user_id_saved_in_local_storage, event.target.value);

				setSearch(data.text)
				setLista(Object.values(data.object))

			} catch (error) {
				console.error('Error fetching user query:', error);
				Swal.fire(`No se pudo obtener tu búsqueda`);
			}
		};

		// Llamar a la función de solicitud
		fetchUserQuery();
	};

	const handleSubmitOpenIA = async (event) => {
		event.preventDefault();
		setLoading(true);
		try {
			const response = await fetch("https://smart-buyer-bf8t.onrender.com/gpt_create_products_list", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					inputText: search,
				}),
			});

			if (response.ok) {
				const formattedList = await response.json();
				console.log(formattedList);
				setLista(formattedList.lines);
				setLoading(false);
			} else {
				console.error("Error en la petición:", response.statusText);
			}
		} catch (error) {
			console.error("Error al realizar la petición:", error);
		}
	};

	const handleStartRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;

			mediaRecorder.ondataavailable = (event) => {
				audioChunksRef.current.push(event.data);
			};

			mediaRecorder.onstop = async () => {
				const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
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
			formData.append("audio", audioBlob, "recording.webm");

			const response = await fetch("https://smart-buyer-bf8t.onrender.com/transcribes", {
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

	const handleButtonSearch = async (event) => {
		console.log("button search clicked")
		Swal.fire({
			title: "¿Quieres guardar esta búsqueda?",
			showDenyButton: true,
			showCancelButton: true,
			confirmButtonText: "Guardar",
			denyButtonText: `No Guardar`
		}).then(async (result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				const inputValue = "";
				const { value: title } = await Swal.fire({
					title: "Escribe cómo quieres guardar tu búsqueda",
					input: "text",
					inputLabel: "El título de tu búsqueda",
					inputValue,
					showCancelButton: true,
					inputValidator: (value) => {
						if (!value) {
							return "Necesitas escribir algo!";
						}
					}
				});
				const myObject = {}
				lista.forEach((item, index) => {
					myObject[index] = item
				})
				if (title) {
					const myResponse = async () => {
						// Realizar solicitud de inicio de sesión utilizando los datos del formulario
						const req_succesful = await postQuery({
							user_id: localStorage.getItem("user_id"),
							title: title,
							text: search,
							object: myObject,
						});
						if (req_succesful == "Query guardada con exito") {
							Swal.fire(`Se ha guardado tu búsqueda: ${title}`).then(() => {
								setTimeout(() => {
									//window.location.reload();
									//proceder a hacer la animacion de busqueda
								}, 100);
							});
						} else {
							Swal.fire(`No se pudo guardar tu búsqueda: ${title}`);
						}
					}
					const a = await myResponse()
					console.log(a)
				}
			} else if (result.isDenied) {//si no se quiere guardar la busqueda
				Swal.fire("Colocar aqui la animacion de busqueda en vez de este anuncio", "", "info");
			}
		});

	}

	const halfScreenWidth = "50vw";
	return (
		<div className="font-text flex flex-col items-center justify-center text-center p-4">
			<header className="flex flex-col items-center justify-center w-full max-w-lg">
				<img src="/images/logo.png" className="mt-10 w-60 md:w-80" alt="logo" />
				<select
					value={selectedValue}
					onChange={handleChange}
					onClick={(e) => fetchUserQueries()}
					className="list-control rounded-pill mt-4 w-full p-2"
					data-testid="select"
				>
					<option value="">Seleccionar búsqueda guardada</option>
					{titles.map((title, index) => (
						<option key={index} value={title}>{title}</option>
					))}
				</select>
				{/* ICONO PERFIL */}
				<Link to="/login">
					<FaUser className="absolute top-2 right-2 text-2xl cursor-pointer mt-8 mr-8" />
				</Link>

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
				<p className="text-lg sm:text-xl mt-4">Tu lista actualmente se ve así:</p>
				{lista.map((texto, index) => (
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
				))}
				<button
					className=" boton mt-4 bg-[#e29500] hover:bg-[#cb8600] text-white text-xl rounded-lg w-fit px-4 h-10"
					type="submit"
					onClick={(event) => handleButtonSearch(event)} // Invocar la función dentro de una función anónima
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
	);
}

export default Search;