import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddToolForm } from '../components/AddToolForm';

describe('AddToolForm', () => {
  const defaultProps = {
    onSubmit: () => {},
    onCancel: () => {},
  };

  it('renders the form with all fields', () => {
    render(<AddToolForm {...defaultProps} />);
    expect(screen.getByText('Lend a Tool')).toBeInTheDocument();
    expect(screen.getByLabelText(/tool name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
  });

  it('shows validation errors for required fields', () => {
    render(<AddToolForm {...defaultProps} />);
    const submitButton = screen.getByRole('button', { name: /list my tool/i });
    fireEvent.click(submitButton);
    expect(screen.getByText('Tool name is required.')).toBeInTheDocument();
    expect(screen.getByText('Please describe your tool.')).toBeInTheDocument();
    expect(screen.getByText('Your name is required.')).toBeInTheDocument();
    expect(screen.getByText('Location is required.')).toBeInTheDocument();
  });

  it('calls onSubmit with form data when valid', () => {
    const onSubmit = vi.fn();
    render(<AddToolForm {...defaultProps} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/tool name/i), {
      target: { value: 'Test Drill' },
    });
    fireEvent.change(screen.getByLabelText(/^description/i), {
      target: { value: 'A great drill for testing.' },
    });
    fireEvent.change(screen.getByLabelText(/your name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: 'Test Street' },
    });

    fireEvent.click(screen.getByRole('button', { name: /list my tool/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Test Drill',
      description: 'A great drill for testing.',
      category: 'hand-tools',
      condition: 'good',
      ownerName: 'Test User',
      location: 'Test Street',
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(<AddToolForm {...defaultProps} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('shows success state after valid submission', () => {
    render(<AddToolForm {...defaultProps} onSubmit={() => {}} />);

    fireEvent.change(screen.getByLabelText(/tool name/i), {
      target: { value: 'My Saw' },
    });
    fireEvent.change(screen.getByLabelText(/^description/i), {
      target: { value: 'Circular saw.' },
    });
    fireEvent.change(screen.getByLabelText(/your name/i), {
      target: { value: 'Bob' },
    });
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: 'Oak St' },
    });

    fireEvent.click(screen.getByRole('button', { name: /list my tool/i }));

    expect(screen.getByText('Tool Listed!')).toBeInTheDocument();
    expect(screen.getByText(/my saw/i)).toBeInTheDocument();
  });
});
