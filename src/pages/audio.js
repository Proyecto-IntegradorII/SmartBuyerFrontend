import React, { useState, useRef } from 'react';
import { FaMicrophone } from 'react-icons/fa';

const AudioRecorder = () => {
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

    mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    setAudioUrl(audioUrl);
    audioChunksRef.current = [];
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

return (
    <div>
    <div onClick={isRecording ? handleStopRecording : handleStartRecording}>
        <FaMicrophone style={{ transform: 'translateX(350px)', marginTop: '-3vw' }} />
    </div>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    {audioUrl && <audio controls src={audioUrl} />}
    </div>
);
};

export default AudioRecorder;
