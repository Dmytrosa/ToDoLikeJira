import '@testing-library/jest-dom/extend-expect';
import React from 'react'; 

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/ToDo/i);
  expect(linkElement).toBeInTheDocument();
});
