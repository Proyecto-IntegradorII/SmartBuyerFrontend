import React, { useState, useRef } from 'react';
import { FaEdit, FaTrash, FaMicrophone, FaUser } from 'react-icons/fa';

function Search() {
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState(false);
  const [estadoEdit, setEstadoEdit] = useState("Edit");
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [lista, setLista] = useState(["carne", "pollo"]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        audioChunksRef.current = [];
        await sendAudioToServer(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null); // Limpiar cualquier error previo
    } catch (error) {
      console.error('Error accessing microphone', error);
      setError('No se pudo acceder al micrófono. Por favor, otorga permisos para usar el micrófono.');
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
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('http://localhost:9000/transcribes', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error al enviar el audio al servidor');
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      setSearch(data.transcripcion);
    } catch (error) {
      console.error('Error al enviar el audio', error);
      setError('Error al enviar el audio al servidor');
    }
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  const handleEdit = (index, texto) => {
    setEditIndex(index);
    setEditValue(editValue);
    setEdit(!edit);
    setEstadoEdit("Save")
    if (edit) {
      const nuevaLista = [...lista];
      nuevaLista[index] = editValue;
      setLista(nuevaLista);
      setEstadoEdit("Edit");
    }
  };

  const handleDelete = (index) => {
    const nuevaLista = [...lista];
    nuevaLista.splice(index, 1);
    setLista(nuevaLista);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <header className="flex flex-col items-center justify-center w-full max-w-lg">
        <img src="/images/logo.png" className="mt-10 w-40 sm:w-60 md:w-80" alt="logo" />
        <FaUser className="absolute top-2 right-2 text-2xl cursor-pointer mt-4" />
        <div className="relative mt-8 w-full">
          <input
            value={search}
            type="text"
            className="form-control w-full h-12 sm:h-16 border border-orange-600 bg-gray-300 text-lg sm:text-xl text-center rounded-lg"
            onChange={handleInputChange}
          />
          <div onClick={isRecording ? handleStopRecording : handleStartRecording} className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer">
            <FaMicrophone className="text-xl sm:text-2xl" />
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        <p className="text-lg sm:text-xl mt-4">Tu lista actualmente se ve así:</p>
        {lista.map((texto, index) => (
          <div key={index} className="flex items-center mt-4 w-full">
            <input
              type="text"
              className="form-list w-full h-10 border border-orange-600 bg-gray-300 text-lg sm:text-xl text-center rounded-lg"
              value={editIndex === index ? editValue : texto}
              readOnly={editIndex !== index}
              onChange={(e) => setEditValue(e.target.value)}
            />
            <FaEdit className="text-lg sm:text-xl ml-2 sm:ml-4 cursor-pointer" onClick={() => handleEdit(index, texto)} aria-label={estadoEdit} />
            <FaTrash className="text-lg sm:text-xl ml-2 sm:ml-4 cursor-pointer" onClick={() => handleDelete(index)} aria-label="Delete" />
          </div>
        ))}
        <button className="boton mt-4 bg-orange-600 text-white text-lg sm:text-xl rounded-lg w-24 sm:w-32 h-10" type="submit">Buscar</button>
      </header>
      <h2 className="text-xl sm:text-2xl font-normal mt-8">Tu lista será cotizada automáticamente en:</h2>
      <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-8">
        <div className="image-box w-24 h-24 sm:w-40 sm:h-40 bg-center bg-cover rounded-3xl shadow-lg" style={{ backgroundImage: 'url(/images/images.png)' }}>
          <div className="image-name hidden">Exito</div>
        </div>
        <div className="image-box w-24 h-24 sm:w-40 sm:h-40 bg-center bg-cover rounded-3xl shadow-lg" style={{ backgroundImage: 'url(/images/D1.jpg)' }}>
          <div className="image-name hidden">D1</div>
        </div>
        <div className="image-box w-24 h-24 sm:w-40 sm:h-40 bg-center bg-cover rounded-3xl shadow-lg" style={{ backgroundImage: 'url(/images/jumbo.jpg)' }}>
          <div className="image-name hidden">Jumbo</div>
        </div>
      </div>
    </div>
  );
}

export default Search;
