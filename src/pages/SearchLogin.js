import { useState } from "react";

function SearchL() {
  const [search, setSearch] = useState("");
  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <header className="flex flex-col items-center justify-center w-full max-w-md">
        <img src="/images/logo.png" className="mt-20 w-40 sm:w-60 md:w-80" alt="logo" />
        <select
          value={selectedValue}
          onChange={handleChange}
          className="list-control rounded-pill mt-4 w-full p-2"
          data-testid="select" 
        >
          <option value="">Seleccionar búsqueda guardada</option>
          <option value="opcion1">Opción 1</option>
          <option value="opcion2">Opción 2</option>
          <option value="opcion3">Opción 3</option>
        </select>
        <input
          value={search}
          type="text"
          placeholder="Nueva búsqueda"
          className="form-control rounded-pill mt-4 w-full p-2"
          onChange={handleInputChange}
        />
        <button className="boton mt-4 bg-orange-600 text-white text-xl rounded-lg w-32 h-10" type="submit">Buscar</button>
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

export default SearchL;
