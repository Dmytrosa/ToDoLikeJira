import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FadeInWindow from './FadeInWindow';

describe('FadeInWindow component', () => {
  test('renders children and calls onClose after timeout', async () => {
    const onClose = jest.fn();
    const childrenText = 'Тестовий текст';

    render(<FadeInWindow onClose={onClose}>{childrenText}</FadeInWindow>);

    const childrenElement = screen.getByText(childrenText);
    expect(childrenElement).toBeInTheDocument();

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1), { timeout: 3500 });
  });
});
