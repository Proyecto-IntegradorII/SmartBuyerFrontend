import React, { useState } from "react";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const SendText = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
 
  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Mostrar el spinner

    try {
      // Llamar a la función gpt() con el texto ingresado
      await gpt(text);
    } catch (error) {
      console.error("Error processing text:", error);
      setIsLoading(false); // Ocultar el spinner
    }
  };

  async function gpt(inputText) {
   

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            content: inputText,
            role: "user",
          },
        ],
      });

      const data = response.choices[0].message.content;
      setResponse(data);
      setIsLoading(false); // Ocultar el spinner
      console.log(data)
    } catch (error) {
      console.error("Error fetching response from OpenAI:", error);
      setIsLoading(false); // Ocultar el spinner
    }
  }

  return (
    <div className="flex justify-center items-center h-screen pb-8 font-text">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-[36rem]"
      >
        <div className="mb-4">
          <label htmlFor="text" className="block text-gray-700 text-xl font-bold mb-2 text-center">
            Ingresa el texto que deseas analizar:
          </label>
          <textarea
            id="text"
            name="text"
            onChange={handleTextChange}
            className="border border-gray-400 rounded w-full py-4 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center justify-center">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-900"></div>
            </div>
          ) : (
            <button
              type="submit"
              className="w-48 z-10 bg-lime-900 hover:bg-lime-700 active:bg-lime-600 text-white font-bold py-2 px-4 rounded-xl text-xl border h-12 shadow-sm"
            >
              Enviar
            </button>
          )}
        </div>
        {response && (
          <div className="mt-4">
            <pre className="text-left">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </form>
    </div>
  );
};

export default SendText;
