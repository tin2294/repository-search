import { render, screen } from '@testing-library/react';
import SearchBar from './Search';


test('render placeholder element', () => {
  render(<SearchBar />);
  expect(screen.getByPlaceholderText('Search Repositories')).toBeInTheDocument();
});
