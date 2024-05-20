import { useState } from "react";
import './Search.css';
import { FaEdit, FaTrash, FaMicrophone } from 'react-icons/fa';

function Search() {
  const [search, setSearch] = useState("")
  const [edit, setEdit] = useState(false)

  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");


  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };
  const handleEdit = (index,texto) => {
    setEditIndex(index);
    setEditValue(editValue);
    setEdit(!edit);

    if(edit)
      {
        const nuevaLista = [...lista]; // Copia el array original
        nuevaLista[index] = editValue; // Actualiza el valor del elemento editado
        setLista(nuevaLista); // Actualiza el estado con la nueva lista
       
      }
    console.log(index)
  };


  const handleDelete = (index) => {
    const nuevaLista = [...lista]; // Crear una copia del array original
    nuevaLista.splice(index, 1); // Eliminar el elemento en el índice dado
    setLista(nuevaLista); // Actualizar el estado con la nueva lista
  };
  
  const [lista, setLista] = useState(["carne", "pollo"]);


    return (
      <div className="Search">
        <header className="Search-header">
        <img src="/images/logo.png" className="Search-logo" alt="logo" />
          <input
              value={search}
              type="text"
              className="form-contro" 
              onChange={handleInputChange}
              style={{ marginRight: '10px' }}
          />
          <FaMicrophone className="input-icon"  />

          <p>Tu lista actualmente se ve así:</p>
          {lista.map((texto, index) => (
            <div key={index} className="input-with-icon">
            <input
              type="text"
              className="form-list"
              value={editIndex === index ? editValue : texto}
              readOnly={!edit}
              onChange={(e) => setEditValue(e.target.value)}
              style={{ marginBottom: '1vw', marginLeft: '4vw' }}
            />
            <FaEdit className="icon" onClick={() => handleEdit(index, texto)} style={{ marginLeft: '1vw' }} />
            <FaTrash className="icon" onClick={() => handleDelete(index)} style={{ marginLeft: '1vw' }}/>
          </div>
          ))}
        <button  className="boton" type="submit"    style={{ margin: '1vw', padding: 0 }} >Buscar</button>
   
        </header >
        <h2 style={{ marginRight: '16vw', fontSize: '2vw', fontWeight: 'normal' }}>Tu lista será cotizada automáticamente en:</h2>
        <div className="image-boxes-container">
          <div className="image-box" style={{ backgroundImage: 'url(/images/images.png)' }}>
            <div className="image-name">Exito</div>
          </div>
          <div className="image-box" style={{ backgroundImage: 'url(/images/D1.jpg)' }}>
            <div className="image-name">D1</div>
          </div>
          <div className="image-box" style={{ backgroundImage: 'url(/images/jumbo.jpg)' }}>
            <div className="image-name">Jumbo</div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Search;