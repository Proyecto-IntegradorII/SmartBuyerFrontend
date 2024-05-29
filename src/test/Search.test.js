import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';


import Search from '../pages/Search';
test('renders Search component', () => {
    const { getByText, getByRole } = render(<Search />);

    expect(getByText('Tu lista actualmente se ve así:')).toBeInTheDocument();
     // Verifica el botón por su className
  const button = getByRole('button', { className: /boton/ });
  expect(button).toBeInTheDocument();
});

test('handleDelete actualiza correctamente el estado de lista', () => {
    const { queryAllByLabelText, queryByText } = render(<Search />);
    const deleteButtons = queryAllByLabelText('Delete'); // Suponiendo que los iconos tienen aria-label="Delete"
  
    fireEvent.click(deleteButtons[0]); // Puedes usar un índice específico si sabes cuál es el botón que quieres clickear
  
    expect(queryByText('carne')).toBeNull(); // Suponiendo que 'carne' ya no está en tu lista
  });

  test('handleEdit updates edit state correctly', () => {
    const { queryAllByLabelText } = render(<Search />);
  const editButtons = queryAllByLabelText('Edit');

  // Assuming you want to interact with the first edit button
  const editButton = editButtons[0];

  fireEvent.click(editButton);
  
  expect(editButton).toHaveAttribute('aria-label', 'Save');

  fireEvent.click(editButton);
  expect(editButton).toHaveAttribute('aria-label', 'Edit');
  });

 /* test('handleEditValue updates editValue state correctly', () => {
    const { getByPlaceholderText, container } = render(<Search />);
    const input = container.getElementsByClassName('form-list')[0];
    
    fireEvent.click(input);

    fireEvent.change(input, { target: { value: 'nueva búsqueda' } });
    fireEvent.click(input);
    expect(input.value).toBe('nueva búsqueda');
  

  });*/

  test('handleInputChange updates search state correctly', () => {
    const { container } = render(<Search />);
    const input = container.getElementsByClassName('form-contro')[0]; // Busca por classname
  
    fireEvent.change(input, { target: { value: 'nueva búsqueda' } });
  
    expect(input.value).toBe('nueva búsqueda');
  });
  
  
  