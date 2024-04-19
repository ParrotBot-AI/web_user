

const tailwindConfig = {
  content: ['./src/**/*.vue'],
  mode: 'jit',
  corePlugins: {
    preflight: false,
  },
  theme: {
    boxShadow: {
      'lg': '0px 4px 20px 0px rgba(27, 139, 140, 0.20)',
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1025px',
      xl: '1400px',
    },
    colors: {
      'login-bg': 'var(--color-login-bg)',
      'form': 'var(--color-form)',
      'green-1': 'var(--color-green-1)',
      'green-2': 'var(--color-green-2)',
      'white': 'var(--color-white)',
      'gray-900': 'var(--color-gray-900)',
      'gray-400': 'var(--color-gray-400)',
      'gray-500': 'var(--color-gray-500)',
      'gray-600': 'var(--color-gray-600)',
      'gray-700': 'var(--color-gray-700)',
      'border-1': 'var(--color-border)',
      'green-3': 'var(--color-green-3)',
      'blue-1': 'var(--color-blue-1)',
      'blue-2': 'var(--color-blue-2)',
      'black-1': 'var(--color-black-1)',
      'yellow-1': 'var(--color-yellow-1)',
      'yellow-2': 'var(--color-yellow-2)',
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
