// src/App.js
import React, { useState } from 'react';
import info from './info.json';

const Results = () => {
  const [selectedProducts, setSelectedProducts] = useState(
    info.response.map(product => product.results[0].products)
  );

  const handleSelectProduct = (productIndex, storeIndex, columnIndex) => {
    console.log("productIndex: "+ productIndex);
    console.log("storeIndex:" +storeIndex);
    console.log("columnIndex:" + columnIndex);
    const newSelectedProducts = [...selectedProducts];
    console.log("Paso 1: "+JSON.stringify(newSelectedProducts));
    const tempProduct = newSelectedProducts[productIndex][columnIndex];
    console.log("Paso 2: "+JSON.stringify(tempProduct));
    newSelectedProducts[productIndex][columnIndex] = info.response[productIndex].results[storeIndex].products[columnIndex];
    console.log("newSelectedProducts: "+JSON.stringify(newSelectedProducts))
    console.log("Paso 3:" + JSON.stringify(newSelectedProducts[productIndex][columnIndex]))
    info.response[productIndex].results[storeIndex].products[columnIndex] = tempProduct;
    console.log("Paso4: "+JSON.stringify(info.response[productIndex].results[storeIndex].products[columnIndex]));
    setSelectedProducts(newSelectedProducts);
  };

  const calculateTotal = (storeIndex) => {
    return selectedProducts.reduce((total, product) => total + product[storeIndex].priceDiscounted, 0);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Encontramos los siguientes productos de acuerdo a tus necesidades</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <img src="/images/images.png" alt="Exito" className="h-16 mx-auto" />
        <img src="/images/jumbo.jpg" alt="Jumbo" className="h-16 mx-auto" />
        <img src="/images/Olimpical.png" alt="Olimpica" className="h-16 mx-auto" />
      </div>

      {info.response.map((product, productIndex) => (
        <div key={productIndex} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{product.productName}</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {selectedProducts[productIndex].map((item, index) => (
              <div key={index} className="text-center">
                <img src={item.imageUrl || item.imgSrc} alt={item.name} className="h-24 mx-auto mb-2" />
                <div>{item.name}</div>
                <div className="font-bold">${item.priceDiscounted}</div>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-medium mb-2">Productos Similares</h3>
          {info.response[productIndex].results.slice(1).map((result, storeIndex) => (
            <div key={storeIndex + 1}>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {result.products.map((item, columnIndex) => (
                  <div className='flex items-center justify-center' key={columnIndex}>
                    <button
                      className="flex items-center justify-center"
                      onClick={() => handleSelectProduct(productIndex, storeIndex + 1, columnIndex)}
                    >
                      <img src="/images/check.png" alt="Seleccionar" className="h-6 w-6" />
                    </button>
                    <div className="flex flex-col items-center w-48">
                      <div>{item.name}</div>
                      <div className="font-bold">${item.priceDiscounted}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Total a pagar</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold">Éxito</h3>
            <div className="font-bold">${calculateTotal(0)}</div>
          </div>
          <div>
            <h3 className="font-semibold">Jumbo</h3>
            <div className="font-bold">${calculateTotal(1)}</div>
          </div>
          <div>
            <h3 className="font-semibold">Olímpica</h3>
            <div className="font-bold">${calculateTotal(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;