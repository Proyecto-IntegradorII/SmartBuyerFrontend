import { useState } from "react";
import './Search.css';

function SearchL() {
  const [search, setSearch] = useState("")
  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

    return (
      <div className="Search">
        <header className="Search-header">
        <img src="/images/logo.png" className="Search-logo" alt="logo" />
        <select value={selectedValue} onChange={handleChange} className="list-control rounded-pill" >
        <option value="">Seleccionar busqueda guardada</option>
          <option value="opcion1">Opción 1</option>
          <option value="opcion2">Opción 2</option>
          <option value="opcion3">Opción 3</option>
        </select>
          <input
              value={search}
              type="text"
              placeholder="Nueva busqueda"
              className="form-control rounded-pill" 
              onChange={handleInputChange}
              style={{ marginRight: '10px' }}
          />
        <button  className="boton" type="submit"    style={{ margin: '50px', padding: 0 }} >Buscar</button>
   
        </header>
      </div>
    );
  }
  
  export default SearchL;