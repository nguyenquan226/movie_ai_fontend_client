import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        // Fade animations
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'fade-in-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },

        // Slide animations
        'slide-in-right': {
          '0%': {
            transform: 'translateX(100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1'
          },
        },
        'slide-in-left': {
          '0%': {
            transform: 'translateX(-100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1'
          },
        },

        // Scale animations
        'scale-in': {
          '0%': {
            transform: 'scale(0.9)',
            opacity: '0'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1'
          },
        },
        'scale-out': {
          '0%': {
            transform: 'scale(1)',
            opacity: '1'
          },
          '100%': {
            transform: 'scale(0.9)',
            opacity: '0'
          },
        },

        // Pulse animations
        'pulse-soft': {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)'
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale(0.98)'
          },
        },

        // Shimmer effect
        'shimmer': {
          '0%': {
            backgroundPosition: '-1000px 0'
          },
          '100%': {
            backgroundPosition: '1000px 0'
          },
        },

        // Bounce animations
        'bounce-in': {
          '0%': {
            transform: 'scale(0.3)',
            opacity: '0'
          },
          '50%': {
            transform: 'scale(1.05)',
            opacity: '1'
          },
          '70%': {
            transform: 'scale(0.9)'
          },
          '100%': {
            transform: 'scale(1)'
          },
        },

        // Rotate animations
        'rotate-in': {
          '0%': {
            transform: 'rotate(-180deg) scale(0.5)',
            opacity: '0'
          },
          '100%': {
            transform: 'rotate(0) scale(1)',
            opacity: '1'
          },
        },

        // Flip animations
        'flip-in': {
          '0%': {
            transform: 'perspective(400px) rotateY(90deg)',
            opacity: '0'
          },
          '40%': {
            transform: 'perspective(400px) rotateY(-10deg)'
          },
          '70%': {
            transform: 'perspective(400px) rotateY(10deg)'
          },
          '100%': {
            transform: 'perspective(400px) rotateY(0)',
            opacity: '1'
          },
        },

        // Background color pulse (your original animation enhanced)
        'light-blur': {
          '0%, 100%': {
            backgroundColor: '#fffa',
          },
          '33%': {
            backgroundColor: '#db586e',
          },
          '66%': {
            backgroundColor: '#6477c2',
          },
        },

        // Glow effect
        'glow': {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.3)'
          },
          '50%': {
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6)'
          },
        },

        // Wiggle animation
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },

        // Shake animation
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },

        // Gradient animation
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        // Fade
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-out': 'fade-out 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'fade-in-down': 'fade-in-down 0.6s ease-out',

        // Slide
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'slide-in-left': 'slide-in-left 0.5s ease-out',

        // Scale
        'scale-in': 'scale-in 0.3s ease-out',
        'scale-out': 'scale-out 0.3s ease-out',

        // Pulse
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',

        // Shimmer
        'shimmer': 'shimmer 2s linear infinite',

        // Bounce
        'bounce-in': 'bounce-in 0.6s ease-out',

        // Rotate
        'rotate-in': 'rotate-in 0.6s ease-out',

        // Flip
        'flip-in': 'flip-in 0.6s ease-out',

        // Your enhanced animation
        'light-blur': 'light-blur 3s ease-in-out infinite',
        'light-blur-fast': 'light-blur 1.5s ease-in-out infinite',
        'light-blur-slow': 'light-blur 5s ease-in-out infinite',

        // Glow
        'glow': 'glow 2s ease-in-out infinite',

        // Wiggle
        'wiggle': 'wiggle 1s ease-in-out infinite',

        // Shake
        'shake': 'shake 0.5s ease-in-out',

        // Gradient
        'gradient-shift': 'gradient-shift 3s ease infinite',
      },

      // Animation delays
      animationDelay: {
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },

      // Animation durations
      animationDuration: {
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
        '1500': '1500ms',
        '2000': '2000ms',
      },
    },
  },
  plugins: [],
};

export default config;