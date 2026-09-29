/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        indigo: { DEFAULT: '#6266D9', soft: '#ECECFB', dark: '#4B4FC2' },
        lavande: { DEFAULT: '#A9A7F4', soft: '#F1F0FD' },
        menthe: { DEFAULT: '#70C9AE', soft: '#E6F6F0' },
        peche: { DEFAULT: '#F3B88C', soft: '#FDF1E7' },
        fond: '#F7F8FC',
        carte: '#FFFFFF',
        ink: { DEFAULT: '#24263B', muted: '#6F7285' },
        bord: '#E5E6F0',
        succes: { DEFAULT: '#55B892', soft: '#E4F4ED' },
        attention: { DEFAULT: '#E9AD52', soft: '#FCF2E2' },
        important: { DEFAULT: '#E47777', soft: '#FCEAEA', dark: '#D65C5C' },
        info: { DEFAULT: '#659DE5', soft: '#E8F0FC' }
      },
      fontFamily: { sans: ['"Plus Jakarta Sans Variable"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'] },
      borderRadius: { xl2: '20px', xl3: '28px' },
      boxShadow: { card: '0 6px 24px rgba(36, 38, 59, 0.06)', lift: '0 12px 30px rgba(98, 102, 217, 0.28)' }
    }
  },
  plugins: []
}
