const shared = require("@carbon/config/tailwind/tailwind.config");
const containerQueries = require("@tailwindcss/container-queries");

module.exports = {
  ...shared,
  plugins: [...(shared.plugins ?? []), containerQueries],
  content: [
    "./app/**/*.{ts,tsx}",
    "../../packages/{react,form,tiptap,ee}/src/**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/__tests__/**",
    "!**/*.{test,spec,server,d}.{ts,tsx}",
  ],
};
