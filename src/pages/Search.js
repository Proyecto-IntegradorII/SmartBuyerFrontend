import React, { useState, useRef } from 'react';
import { FaEdit, FaTrash, FaMicrophone } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
function Search() {
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState(false);
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
    setError(null);  // Limpiar cualquier error previo
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

    if (edit) {
    const nuevaLista = [...lista];
    nuevaLista[index] = editValue;
    setLista(nuevaLista);
    }
  };

  const handleDelete = (index) => {
    const nuevaLista = [...lista];
    nuevaLista.splice(index, 1);
    setLista(nuevaLista);
  };

  return (
    <div className="text-center">
    <header className="flex flex-col items-center justify-center">
    <img src="/images/logo.png" className="mt-20 w-80" alt="logo" />
    <FaUser 
    className="absolute top-2 right-2 text-2xl cursor-pointer" 
    style={{ marginTop: '3vw' }} 
    />

    <div className="relative mt-8"  style={{marginTop: '3vw', marginBottom: '20px'}}>

    <input
    value={search}
    type="text"
    className="form-contro w-96 h-32 border border-orange-600 bg-gray-300 text-xl text-center rounded-lg"
    onChange={handleInputChange}
    />
    <div onClick={isRecording ? handleStopRecording : handleStartRecording}>
    <FaMicrophone style={{ transform: 'translateX(350px)', marginTop: '-3vw' }} />
    {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    </div>
    <p className="text-xl mt-4">Tu lista actualmente se ve así:</p>
    {lista.map((texto, index) => (
    <div key={index} className="flex items-center mt-4" style={{ marginRight: '-5vw' }}>
    <input
              type="text"
              className="form-list w-96 h-10 border border-orange-600 bg-gray-300 text-xl text-center rounded-lg"
              value={editIndex === index ? editValue : texto}
              readOnly={!edit}
              onChange={(e) => setEditValue(e.target.value)}
            />
            <FaEdit className="text-xl ml-4 cursor-pointer" onClick={() => handleEdit(index, texto)} />
            <FaTrash className="text-xl ml-4 cursor-pointer" onClick={() => handleDelete(index)} />
          </div>
        ))}
        <button className="boton mt-4 bg-orange-600 text-white text-xl rounded-lg w-32 h-10" type="submit">Buscar</button>
      </header>
      <h2 className="mr-64 text-2xl font-normal mt-8" style={{ marginRight: '14vw' }}>Tu lista será cotizada automáticamente en:</h2>
      <div className="flex justify-center gap-20 mt-8">
  <div className="image-box w-40 h-40 bg-center bg-cover rounded-3xl shadow-lg" style={{ backgroundImage: 'url(/images/images.png)' }}>
    <div className="image-name hidden">Exito</div>
  </div>
  <div className="image-box w-40 h-40 bg-center bg-cover rounded-3xl shadow-lg" style={{ backgroundImage: 'url(/images/D1.jpg)' }}>
    <div className="image-name hidden">D1</div>
  </div>
  <div className="image-box w-40 h-40 bg-center bg-cover rounded-3xl shadow-lg" style={{ backgroundImage: 'url(/images/jumbo.jpg)' }}>
    <div className="image-name hidden">Jumbo</div>
  </div>
</div>

    </div>
  );
}

export default Search;
