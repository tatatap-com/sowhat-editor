import { defineConfig } from 'vite';

export default defineConfig(({ command, mode }) => {
  if (command === 'build' && mode === 'production') {
    return {
      base: '/sowhat-editor/',
      build: {
        emptyOutDir: false,
        lib: {
          entry: 'lib/index.js',
          name: 'SowhatEditor',
          formats: ['umd'],
          fileName: (format) => `sowhat-editor.${format}.js`
        }
      }
    }
  } else {
    return {};
  }
});
