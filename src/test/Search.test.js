import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // Importa BrowserRouter
import fetchMock from 'jest-fetch-mock';

import Search from '../pages/Search';

beforeEach(() => {
  fetchMock.resetMocks();
});



const { getByPlaceholderText, getByText , getByDisplayValue, queryByText, getByRole } = render(<Router>
  <Search />
</Router>);



//funciona
test('handles input change correctly', () => {
  const textarea = getByPlaceholderText('Azúcar blanca 2.5kg, Café Aguila Roja 500 gramos, Leche bolsa 6 unidades 1 ml Alpina...');

  fireEvent.change(textarea, { target: { value: 'Azúcar blanca 2.5kg' } });

  expect(textarea.value).toBe('Azúcar blanca 2.5kg');
});

test('renders Search component', () => {
  const { getByText } = render(<Router>
    <Search />
  </Router>);
  expect(getByText('Tu lista actualmente se ve así:')).toBeInTheDocument();
  

});
//revisar
/*test('handles edit correctly', () => {
  const editButton = getByText('Edit');
  fireEvent.click(editButton);

  const input = getByDisplayValue('carne'); // Assuming 'carne' is the initial value in your list
  fireEvent.change(input, { target: { value: 'new value' } });

  const saveButton = getByText('Save');
  fireEvent.click(saveButton);

  expect(input.value).toBe('new value');
});

test('handles audio recording correctly', async () => {
  const startRecordingButton = getByText('Start Recording');
  fireEvent.click(startRecordingButton);

  await waitFor(() => {
    const stopRecordingButton = getByText('Stop Recording');
    fireEvent.click(stopRecordingButton);
  });
});*/


test('handleDelete actualiza correctamente el estado de lista', () => {
  const { queryAllByLabelText, queryByText } = render(<Router>
    <Search />
  </Router>);
  const deleteButtons = queryAllByLabelText('Delete'); // Suponiendo que los iconos tienen aria-label="Delete"

  fireEvent.click(deleteButtons[0]); // Puedes usar un índice específico si sabes cuál es el botón que quieres clickear

  expect(queryByText('carne')).toBeNull(); // Suponiendo que 'carne' ya no está en tu lista
});


test('handleEdit updates edit state correctly', () => {
  const { queryAllByLabelText } = render(<Router>
    <Search />
  </Router>);
const editButtons = queryAllByLabelText('Edit');

// Assuming you want to interact with the first edit button
const editButton = editButtons[0];

fireEvent.click(editButton);

expect(editButton).toHaveAttribute('aria-label', 'Save');

fireEvent.click(editButton);
expect(editButton).toHaveAttribute('aria-label', 'Edit');
});


test('envía texto de búsqueda a OpenIA y actualiza la lista', async () => {
  const { getByPlaceholderText, getByRole, queryByText } = render(<Router>
    <Search />
  </Router>);
  
  // Ingresa el texto en el textarea
  const textarea = getByPlaceholderText('Azúcar blanca 2.5kg, Café Aguila Roja 500 gramos, Leche bolsa 6 unidades 1 ml Alpina...');

  fireEvent.change(textarea, { target: { value: 'Azúcar blanca 2.5kg' } });

  // Simular el clic en el botón "Analizar compras"
  fireEvent.click(getByRole('button', { name: /Analizar compras/i }));
  
  // Esperar a que la lista se actualice
  await waitFor(() => {
    // Verificar que los nuevos elementos están en la lista
    expect(getByText('Azúcar blanca 2.5kg')).toBeInTheDocument();
  });
});

/*test('sends audio recording to server and updates search input', async () => {
  fetchMock.mockResponseOnce(JSON.stringify({ transcripcion: 'Azúcar blanca 2.5kg' }));

  const { getByText } = render(
    <Router>
      <Search />
    </Router>
  );

  const startRecordingButton = getByText('Start Recording');
  fireEvent.click(startRecordingButton);

  await waitFor(() => {
    const stopRecordingButton = getByText('Stop Recording');
    fireEvent.click(stopRecordingButton);
  });

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledWith(
      'https://smartbuyerbackendmain.onrender.com/transcribes',
      expect.any(Object)
    );
  });

  await waitFor(() => {
    const textarea = getByPlaceholderText('Azúcar blanca 2.5kg, Café Aguila Roja 500 gramos, Leche bolsa 6 unidades 1 ml Alpina...');
    expect(textarea.value).toBe('Azúcar blanca 2.5kg');
  });
});*/