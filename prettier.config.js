/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 100,
  endOfLine: 'auto',
  singleAttributePerLine: true,
};

export default config;
