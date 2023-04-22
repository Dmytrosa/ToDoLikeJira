import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import FadeInWindow from './FadeInWindow.tsx';

describe('FadeInWindow component', () => {
  test('renders children and calls onClose after timeout', async () => {
    const onClose = jest.fn();
    const childrenText = 'Тестовий текст';

    render(<FadeInWindow onClose={onClose}>{childrenText}</FadeInWindow>);

    const childrenElement = screen.getByText(childrenText);
    expect(childrenElement).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
