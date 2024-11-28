import { render, screen } from '@testing-library/react';
import React from 'react';
import SimpleButton from '../../src/components/SimpleButton.tsx';
import { test, vi, describe, expect } from 'vitest';
import "@testing-library/jest-dom"

test('renders the button with text', () => {
  render(<SimpleButton text="Click Me" />);
  expect(screen.getByText(/click me/i)).toBeInTheDocument();
});
