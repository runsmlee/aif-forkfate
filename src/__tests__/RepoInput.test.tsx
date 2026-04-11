import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RepoInput } from '../components/RepoInput';

describe('RepoInput', () => {
  it('renders the input field', () => {
    render(<RepoInput />);
    const input = screen.getByLabelText('GitHub Repository URL');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'url');
  });

  it('renders the analyze button', () => {
    render(<RepoInput />);
    const button = screen.getByRole('button', { name: /Analyze repository/i });
    expect(button).toBeInTheDocument();
  });

  it('disables button when input is empty', () => {
    render(<RepoInput />);
    const button = screen.getByRole('button', { name: /Analyze repository/i });
    expect(button).toBeDisabled();
  });

  it('enables button when input has a URL', () => {
    render(<RepoInput />);
    const input = screen.getByLabelText('GitHub Repository URL');
    fireEvent.change(input, { target: { value: 'https://github.com/facebook/react' } });
    const button = screen.getByRole('button', { name: /Analyze repository/i });
    expect(button).not.toBeDisabled();
  });

  it('has correct placeholder text', () => {
    render(<RepoInput />);
    const input = screen.getByPlaceholderText('https://github.com/owner/repo');
    expect(input).toBeInTheDocument();
  });

  it('has a search role form', () => {
    render(<RepoInput />);
    const form = screen.getByRole('search');
    expect(form).toBeInTheDocument();
  });
});
