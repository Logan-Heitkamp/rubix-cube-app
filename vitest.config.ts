/** @type {import('vitest/config').UserConfig} */
export default {
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.test.ts', '**/*.test.tsx'],
  },
};
