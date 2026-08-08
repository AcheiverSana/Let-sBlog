import { test as base, expect } from '@playwright/test';

/**
 * Generates a unique-ish user for signup/signin flows so tests
 * don't collide with each other or with existing data.
 */
export function randomUser() {
  const id = Date.now() + Math.floor(Math.random() * 10000);
  return {
    username: `e2e_user_${id}`,
    email: `e2e_${id}@example.com`,
    password: 'Test1234!',
  };
}

export const test = base;
export { expect };
