import { useState } from "react";
import { FaEdit, FaTrash, FaMicrophone } from 'react-icons/fa';

function Search() {
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [lista, setLista] = useState(["carne", "pollo"]);

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
        <div className="relative mt-8">
          <input
            value={search}
            type="text"
            className="form-contro w-96 h-32 border border-orange-600 bg-gray-300 text-xl text-center rounded-lg"
            onChange={handleInputChange}
          />
          <FaMicrophone className="absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl cursor-pointer" style={{ marginTop: '3vw' }}/>
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
