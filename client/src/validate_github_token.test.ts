import { describe, it, expect } from 'vitest';

describe('GitHub Token Validation', () => {
  it('should be a valid GitHub token', async () => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GITHUB_TOKEN is not set');
    }

    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${token}`,
        'User-Agent': 'Manus-Agent'
      }
    });

    if (!response.ok) {
      console.error(`GitHub API responded with status: ${response.status}`);
    }

    expect(response.status).toBe(200);
    
    const data = await response.json();
    console.log(`Authenticated as GitHub user: ${data.login}`);
    expect(data.login).toBeDefined();
  });
});
