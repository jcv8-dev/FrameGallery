import { render, screen } from '@testing-library/react';
import App from './App';

test('app renders the footer branding', () => {
  render(<App />);
  expect(screen.getByText(/FrameGallery by Caspar von Beöczy/i)).toBeInTheDocument();
});
