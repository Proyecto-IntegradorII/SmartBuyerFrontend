//ARCHIVO PARA HACER LAS SOLICITUDES HTTP
//Usar Authorization: `Bearer ${token}` en el header de los fetch

//Usar API_URL de vercel antes de hacer pull request a main para hacer el despliegue
const API_URL = "https://smart-buyer-bf8t.onrender.com";
//Usar la API_URL del puerto 9000 si se va a trabajar local
//const API_URL = "http://localhost:9000";

export function getAPI_URL() {
	return API_URL;
}

//Solicitud POST para el registro de usuarios
export const postData = async (mydata) => {
	try {
		const response = await fetch(`${API_URL}/register/user`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(mydata),
		});

		//Si se recibe una respuesta exitosa del backend
		if (response.ok) {
			console.log("Data submitted successfully");
			return "Data submitted successfully";
		} else {
			// Handle error response
			const error = await response.json();
			console.error(error);
			return "Email or Username already taken";
		}
	} catch (error) {
		console.error("Error:", error);
		return "Conection failed";
		// Handle network error
	}
};


//POST para realizar el login de los usuarios
export const postLogin = async (mydata) => {
	//Limpiar toda la informacion del usuario incluido el token
	localStorage.clear();

	window.localStorage.clear(); //try this to clear all local storage
	try {
		const response = await fetch(`${API_URL}/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(mydata),
		});

		//Si se obtiene respuesta exitosa del backend
		if (response.ok) {
			const jsonData = await response.json();
			//Obtener datos del usuario
			const { usuarioData, message } = jsonData;

			// Obtener token de la respuesta del servidor
			const token = jsonData.token;
			//Guardar el token en localStorage
			localStorage.setItem("token", token);
			console.log("token recibido del login", token);

			//Guardar datos del usuario en localStorage
			localStorage.setItem("email", JSON.stringify(usuarioData.email));
			localStorage.setItem("user_id", JSON.stringify(usuarioData.user_id));
			localStorage.setItem("nombre_usuario", JSON.stringify(usuarioData.username));

			return "Inicio de sesión exitoso";
		} else {
			const error = await response.json();
			console.error(error);
			// Maneja la respuesta de error
			return "Credenciales incorrectas";
		}
	} catch (error) {
		console.error("Error:", error);
		return "Error de conexión";
	}
};

//POST para realizar el login de los usuarios
export const postLoginGoogle = async (mydata) => {
	//Limpiar toda la informacion del usuario incluido el token
	localStorage.clear();

	window.localStorage.clear(); //try this to clear all local storage
	try {
		const response = await fetch(`${API_URL}/logingoogle`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(mydata),
		});

		//Si se obtiene respuesta exitosa del backend
		if (response.ok) {
			const jsonData = await response.json();
			//Obtener datos del usuario
			const { usuarioData, message } = jsonData;

			// Obtener token de la respuesta del servidor
			const token = jsonData.token;
			//Guardar el token en localStorage
			localStorage.setItem("token", token);
			console.log("token recibido del login", token);

			//Guardar datos del usuario en localStorage
			localStorage.setItem("email", JSON.stringify(usuarioData.email));
			localStorage.setItem("user_id", JSON.stringify(usuarioData.user_id));
			localStorage.setItem("nombre_usuario", JSON.stringify(usuarioData.username));


			return "Inicio de sesión exitoso";
		} else {
			const error = await response.json();
			console.error(error);
			// Maneja la respuesta de error
			return "Credenciales incorrectas";
		}
	} catch (error) {
		console.error("Error:", error);
		return "Error de conexión";
	}
};
