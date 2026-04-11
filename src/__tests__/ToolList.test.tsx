import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToolList } from '../components/ToolList';
import { SAMPLE_TOOLS } from '../lib/tools-data';

describe('ToolList', () => {
  const defaultProps = {
    tools: SAMPLE_TOOLS,
    query: '',
    onQueryChange: () => {},
    selectedCategory: '',
    onCategoryChange: () => {},
    onSelectTool: () => {},
  };

  it('renders the Browse Tools heading', () => {
    render(<ToolList {...defaultProps} />);
    expect(screen.getByText('Browse Tools')).toBeInTheDocument();
  });

  it('shows all tools when no filter is applied', () => {
    render(<ToolList {...defaultProps} />);
    expect(screen.getByText(/tools available near you/i)).toBeInTheDocument();
    // All 8 sample tools should be rendered
    expect(screen.getByText('DeWalt 20V Cordless Drill')).toBeInTheDocument();
    expect(screen.getByText('Werner 24ft Extension Ladder')).toBeInTheDocument();
  });

  it('filters tools by search query', () => {
    render(<ToolList {...defaultProps} query="drill" />);
    expect(screen.getByText('DeWalt 20V Cordless Drill')).toBeInTheDocument();
    expect(screen.queryByText('Werner 24ft Extension Ladder')).not.toBeInTheDocument();
  });

  it('shows empty state when no tools match', () => {
    render(<ToolList {...defaultProps} query="xyz-nonexistent" />);
    expect(screen.getByText('No tools found')).toBeInTheDocument();
  });

  it('calls onQueryChange when typing in search', () => {
    const onQueryChange = vi.fn();
    render(<ToolList {...defaultProps} onQueryChange={onQueryChange} />);
    const input = screen.getByPlaceholderText('Search tools...');
    fireEvent.change(input, { target: { value: 'saw' } });
    expect(onQueryChange).toHaveBeenCalledWith('saw');
  });

  it('calls onCategoryChange when selecting a category', () => {
    const onCategoryChange = vi.fn();
    render(<ToolList {...defaultProps} onCategoryChange={onCategoryChange} />);
    const select = screen.getByDisplayValue('All Categories');
    fireEvent.change(select, { target: { value: 'garden' } });
    expect(onCategoryChange).toHaveBeenCalledWith('garden');
  });

  it('calls onSelectTool when a tool card is clicked', () => {
    const onSelectTool = vi.fn();
    render(<ToolList {...defaultProps} onSelectTool={onSelectTool} />);
    const button = screen.getByRole('button', {
      name: /dewalt 20v cordless drill/i,
    });
    fireEvent.click(button);
    expect(onSelectTool).toHaveBeenCalledTimes(1);
    expect(onSelectTool).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'DeWalt 20V Cordless Drill' })
    );
  });
});
