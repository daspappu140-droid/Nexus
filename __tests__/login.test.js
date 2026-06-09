import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/app/(auth)/login/page';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

describe('LoginPage', () => {
  let mockPush;

  beforeEach(() => {
    mockPush = jest.fn();
    useRouter.mockReturnValue({
      push: mockPush,
    });
    
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Mock fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the login form', () => {
      render(<LoginPage />);
      
      expect(screen.getByText('Sign In')).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should render the NexusBank branding', () => {
      render(<LoginPage />);
      
      expect(screen.getAllByText(/Nexus/i).length).toBeGreaterThan(0);
    });

    it('should render a link to register page', () => {
      render(<LoginPage />);
      
      const registerLink = screen.getByText(/create account/i);
      expect(registerLink).toBeInTheDocument();
      expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
    });
  });

  describe('Email Validation', () => {
    it('should show error when email is empty and field is touched', async () => {
      render(<LoginPage />);
      const emailInput = screen.getByLabelText(/email address/i);
      
      // Focus and blur without entering anything
      fireEvent.focus(emailInput);
      fireEvent.blur(emailInput);
      
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
    });

    it('should show error for invalid email format', async () => {
      render(<LoginPage />);
      const emailInput = screen.getByLabelText(/email address/i);
      
      await userEvent.type(emailInput, 'invalid-email');
      fireEvent.blur(emailInput);
      
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });

    it('should not show error for valid email format', async () => {
      render(<LoginPage />);
      const emailInput = screen.getByLabelText(/email address/i);
      
      await userEvent.type(emailInput, 'user@example.com');
      fireEvent.blur(emailInput);
      
      await waitFor(() => {
        expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
      });
    });

    it('should update error message in real-time after field is touched', async () => {
      render(<LoginPage />);
      const emailInput = screen.getByLabelText(/email address/i);
      
      // Touch the field first
      fireEvent.focus(emailInput);
      fireEvent.blur(emailInput);
      
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
      
      // Type invalid email
      await userEvent.type(emailInput, 'invalid');
      
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
      
      // Clear and type valid email
      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, 'valid@example.com');
      
      await waitFor(() => {
        expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
      });
    });
  });

  describe('Password Validation', () => {
    it('should show error when password is empty and field is touched', async () => {
      render(<LoginPage />);
      const passwordInput = screen.getByLabelText(/password/i);
      
      // Focus and blur without entering anything
      fireEvent.focus(passwordInput);
      fireEvent.blur(passwordInput);
      
      await waitFor(() => {
        expect(screen.getByText('Password is required')).toBeInTheDocument();
      });
    });

    it('should show error when password is less than 6 characters', async () => {
      render(<LoginPage />);
      const passwordInput = screen.getByLabelText(/password/i);
      
      await userEvent.type(passwordInput, '12345');
      fireEvent.blur(passwordInput);
      
      await waitFor(() => {
        expect(screen.getByText('Password must be at least 6 characters long')).toBeInTheDocument();
      });
    });

    it('should not show error when password is 6 or more characters', async () => {
      render(<LoginPage />);
      const passwordInput = screen.getByLabelText(/password/i);
      
      await userEvent.type(passwordInput, '123456');
      fireEvent.blur(passwordInput);
      
      await waitFor(() => {
        expect(screen.queryByText('Password must be at least 6 characters long')).not.toBeInTheDocument();
        expect(screen.queryByText('Password is required')).not.toBeInTheDocument();
      });
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility when eye icon is clicked', async () => {
      render(<LoginPage />);
      const passwordInput = screen.getByLabelText(/password/i);
      
      // Initially should be password type
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Find and click the toggle button
      const toggleButtons = screen.getAllByRole('button');
      const toggleButton = toggleButtons.find(btn => btn.type === 'button' && btn !== screen.getByRole('button', { name: /sign in/i }));
      
      fireEvent.click(toggleButton);
      
      // Should change to text type
      expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Click again to toggle back
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Submission', () => {
    it('should prevent submission when validation errors exist', async () => {
      render(<LoginPage />);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Please fix the validation errors');
        expect(global.fetch).not.toHaveBeenCalled();
      });
    });

    it('should submit form with valid credentials', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { role: 'user' } }),
      });

      render(<LoginPage />);
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await userEvent.type(emailInput, 'user@example.com');
      await userEvent.type(passwordInput, 'password123');
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'user@example.com', password: 'password123' }),
        });
      });
    });

    it('should show success message and redirect on successful login', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { role: 'admin' } }),
      });

      render(<LoginPage />);
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await userEvent.type(emailInput, 'admin@example.com');
      await userEvent.type(passwordInput, 'password123');
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Welcome back!');
        expect(mockPush).toHaveBeenCalledWith('/admin');
      });
    });

    it('should show error message on failed login', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid credentials' }),
      });

      render(<LoginPage />);
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await userEvent.type(emailInput, 'wrong@example.com');
      await userEvent.type(passwordInput, 'wrongpass');
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
      });
    });

    it('should handle network errors gracefully', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<LoginPage />);
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      
      await userEvent.type(emailInput, 'user@example.com');
      await userEvent.type(passwordInput, 'password123');
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Something went wrong');
      });
    });
  });
});
