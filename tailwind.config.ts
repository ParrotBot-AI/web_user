

const tailwindConfig = {
  content: ['./src/**/*.vue'],
  mode: 'jit',
  corePlugins: {
    preflight: false,
  },
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1200px',
    },
    colors: {
      'login-bg': 'var(--color-login-bg)',
      'green-1': 'var(--color-green-1)',
      'green-2': 'var(--color-green-2)',
      'white': 'var(--color-white)',
      'gray-900': 'var(--color-gray-900)',
      'gray-500': 'var(--color-gray-500)',
      'gray-600': 'var(--color-gray-600)',
      'gray-700': 'var(--color-gray-700)',
      'border-1': 'var(--color-border)',
      'green-3': 'var(--color-green-3)',
      'blue-1': 'var(--color-blue-1)',
      'blue-2': 'var(--color-blue-2)',
      'black-1': 'var(--color-black-1)',
      'yellow-1': 'var(--color-yellow-1)',
      'blue-3': 'var(--color-blue-3)',
      'blue-4': 'var(--color-blue-4)',
      'transparent': 'var(--color-transparent)'
    },
    extends: {
      content: {
        'link': 'url("/images/time.svg")',
      },
    }
  },
}

export default tailwindConfig;
