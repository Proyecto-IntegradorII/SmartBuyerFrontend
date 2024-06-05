import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import SearchL from '../pages/SearchLogin';

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
