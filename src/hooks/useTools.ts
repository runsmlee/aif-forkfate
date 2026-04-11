import { useState, useCallback } from 'react';
import type { Tool } from '../lib/types';
import { SAMPLE_TOOLS } from '../lib/tools-data';

type View = 'home' | 'browse' | 'add';

export function useTools() {
  const [tools, setTools] = useState<Tool[]>(SAMPLE_TOOLS);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [view, setView] = useState<View>('home');

  const addTool = useCallback(
    (data: {
      name: string;
      description: string;
      category: Tool['category'];
      condition: Tool['condition'];
      ownerName: string;
      location: string;
    }) => {
      const initials = data.ownerName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      const newTool: Tool = {
        id: String(Date.now()),
        name: data.name,
        description: data.description,
        category: data.category,
        condition: data.condition,
        imageUrl: '',
        owner: {
          id: `o-${Date.now()}`,
          name: data.ownerName,
          avatarInitials: initials,
          distance: '0.1 mi',
          rating: 5.0,
          toolCount: 1,
        },
        available: true,
        location: data.location,
        borrowedBy: null,
        createdAt: new Date().toISOString().split('T')[0],
      };

      setTools((prev) => [newTool, ...prev]);
      return newTool;
    },
    []
  );

  const borrowTool = useCallback(
    (toolId: string, borrowerName: string, _message: string) => {
      setTools((prev) =>
        prev.map((t) =>
          t.id === toolId
            ? { ...t, available: false, borrowedBy: borrowerName }
            : t
        )
      );
      if (selectedTool?.id === toolId) {
        setSelectedTool((prev) =>
          prev ? { ...prev, available: false, borrowedBy: borrowerName } : null
        );
      }
    },
    [selectedTool]
  );

  const navigateTo = useCallback((newView: View) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return {
    tools,
    selectedTool,
    setSelectedTool,
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    view,
    setView: navigateTo,
    addTool,
    borrowTool,
  };
}
