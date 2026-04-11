import { describe, it, expect } from 'vitest';
import { parseRepoUrl } from '../lib/github-api';

describe('parseRepoUrl', () => {
  it('parses a valid GitHub URL', () => {
    const result = parseRepoUrl('https://github.com/facebook/react');
    expect(result).toEqual({ owner: 'facebook', repo: 'react' });
  });

  it('parses URLs with trailing slash', () => {
    const result = parseRepoUrl('https://github.com/facebook/react/');
    expect(result).toEqual({ owner: 'facebook', repo: 'react' });
  });

  it('parses http URLs', () => {
    const result = parseRepoUrl('http://github.com/owner/repo');
    expect(result).toEqual({ owner: 'owner', repo: 'repo' });
  });

  it('returns null for invalid URLs', () => {
    expect(parseRepoUrl('')).toBeNull();
    expect(parseRepoUrl('not-a-url')).toBeNull();
    expect(parseRepoUrl('https://gitlab.com/owner/repo')).toBeNull();
    expect(parseRepoUrl('https://github.com/only-one-segment')).toBeNull();
  });

  it('strips .git suffix from repo name', () => {
    const result = parseRepoUrl('https://github.com/owner/repo.git');
    expect(result).toEqual({ owner: 'owner', repo: 'repo' });
  });
});
