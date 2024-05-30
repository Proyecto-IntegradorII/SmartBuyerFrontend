import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';


import SearchL from '../pages/SearchLogin';
/*test('renders Search component', () => {
    const { getByText, getByRole } = render(<SearchL />);

    expect(getByText('Tu lista actualmente se ve así:')).toBeInTheDocument();
     // Verifica el botón por su className
  const button = getByRole('button', { className: /boton/ });
  expect(button).toBeInTheDocument();
});


  test('handleInputChange updates search state correctly', () => {
    const { container } = render(<SearchL />);
    const input = container.getElementsByClassName('form-contro')[0]; // Busca por classname
  
    fireEvent.change(input, { target: { value: 'nueva búsqueda' } });
  
    expect(input.value).toBe('nueva búsqueda');
  });
  */
  
  test('handleChange updates selectedValue state correctly', () => {
    const { getByTestId } = render(<SearchL />);
    const select = getByTestId('select');
  
    fireEvent.change(select, { target: { value: 'opcion1' } });
  
    expect(select.value).toBe('opcion1');
  });

  test('handleInputChange updates search state correctly', () => {
    const { getByPlaceholderText } = render(<SearchL />);
    const input = getByPlaceholderText('Nueva búsqueda');
  
    fireEvent.change(input, { target: { value: 'nueva búsqueda' } });
  
    expect(input.value).toBe('nueva búsqueda');
  });