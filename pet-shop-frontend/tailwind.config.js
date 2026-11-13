const cor = (n) => `rgb(var(--c-${n}) / <alpha-value>)`;

/** Papéis de cor, tipografia e raios da identidade Pertim (Documentos/03-ui-ux/Identidade-Visual-v1.0.md). */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}', './apps/**/*.{html,ts,tsx}', './packages/**/*.{ts,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      primary: cor('primary'),
      'on-primary': cor('on-primary'),
      'primary-container': cor('primary-container'),
      'on-primary-container': cor('on-primary-container'),
      secondary: cor('secondary'),
      'on-secondary': cor('on-secondary'),
      'secondary-container': cor('secondary-container'),
      'on-secondary-container': cor('on-secondary-container'),
      surface: cor('surface'),
      'on-surface': cor('on-surface'),
      'surface-lowest': cor('surface-container-lowest'),
      'surface-highest': cor('surface-container-highest'),
      'on-surface-variant': cor('on-surface-variant'),
      outline: cor('outline'),
      'outline-variant': cor('outline-variant'),
      error: cor('error'),
      'on-error': cor('on-error'),
      'error-container': cor('error-container'),
      'on-error-container': cor('on-error-container')
    },
    fontFamily: {
      display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
      sans: ['Figtree', 'system-ui', 'sans-serif']
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.375rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.75rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.75rem' }],
      'display-sm': ['2.25rem', { lineHeight: '2.75rem', fontWeight: '800' }],
      'headline-md': ['1.75rem', { lineHeight: '2.25rem', fontWeight: '700' }],
      'headline-sm': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }],
      'title-lg': ['1.375rem', { lineHeight: '1.75rem', fontWeight: '700' }],
      'title-md': ['1rem', { lineHeight: '1.5rem', fontWeight: '600' }],
      'body-lg': ['1rem', { lineHeight: '1.5rem' }],
      'body-md': ['0.875rem', { lineHeight: '1.25rem' }],
      'label-lg': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '600' }],
      'label-md': ['0.75rem', { lineHeight: '1rem', fontWeight: '600' }]
    },
    extend: {
      borderRadius: { sheet: '28px' },
      borderColor: { DEFAULT: cor('outline-variant') },
      ringColor: { DEFAULT: cor('primary') },
      ringOffsetColor: { DEFAULT: cor('surface') }
    }
  },
  plugins: []
};
