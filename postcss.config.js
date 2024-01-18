import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import colorMod from 'postcss-color-mod-function';
import postcssNesting from 'postcss-nesting';

export default {
  plugins: [
    postcssImport,
    tailwind({
      config: './tailwind.config.ts',
    }),
    autoprefixer,
    postcssNesting,
    colorMod,
  ],
};
