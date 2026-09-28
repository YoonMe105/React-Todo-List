import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

beforeEach(() => localStorage.clear());

test('adds a todo and saves it to localStorage', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('New todo'), { target: { value: 'Buy milk' } });
  fireEvent.click(screen.getByText('Add'));

  expect(screen.getByText('Buy milk')).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('todos'))[0].text).toBe('Buy milk');
});

test('loads todos from localStorage', () => {
  localStorage.setItem('todos', JSON.stringify([{ id: 1, text: 'Saved task', completed: false }]));
  render(<App />);
  expect(screen.getByText('Saved task')).toBeInTheDocument();
});
