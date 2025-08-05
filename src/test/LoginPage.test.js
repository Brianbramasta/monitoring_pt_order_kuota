import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../app/page';
import { login } from '@/services/auth';
import { useRouter } from 'next/navigation';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock the auth service
jest.mock('@/services/auth');

describe('LoginPage', () => {
  const mockRouter = {
    push: jest.fn()
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    // Clear mock calls between tests
    login.mockClear();
    mockRouter.push.mockClear();
  });

  test('successful login with valid credentials', async () => {
    // Mock successful API response according to API contract
    const mockResponse = {
      data: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example',
        user: {
          id: 1,
          nama_lengkap: 'Admin Kuota'
        }
      }
    };
    login.mockResolvedValueOnce(mockResponse);

    render(<LoginPage />);

    // Get form elements
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    // Fill in the form
    fireEvent.change(emailInput, { target: { value: 'admin@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Verify API was called with correct data
    expect(login).toHaveBeenCalledWith({
      email: 'admin@gmail.com',
      password: 'admin'
    });

    // Wait for and verify redirect
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/transaction-fail');
    });

    // Verify localStorage was updated
    expect(localStorage.getItem('token')).toBe(mockResponse.data.token);
    expect(localStorage.getItem('isLoggedIn')).toBe('true');
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.data.user));
  });

  test('form validation for empty fields', async () => {
    render(<LoginPage />);

    // Get submit button
    const submitButton = screen.getByRole('button', { name: /login/i });

    // Submit form without filling fields
    fireEvent.click(submitButton);

    // Check for required field validation
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    // Verify HTML5 validation is working
    expect(emailInput).toBeInvalid();
    expect(passwordInput).toBeInvalid();

    // Verify API was not called
    expect(login).not.toHaveBeenCalled();
  });
});
