import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        brand: {
          50: "hsl(var(--color-brand-50))",
          100: "hsl(var(--color-brand-100))",
          200: "hsl(var(--color-brand-200))",
          300: "hsl(var(--color-brand-300))",
          400: "hsl(var(--color-brand-400))",
          500: "hsl(var(--color-brand-500))",
          600: "hsl(var(--color-brand-600))",
          700: "hsl(var(--color-brand-700))",
          800: "hsl(var(--color-brand-800))",
          900: "hsl(var(--color-brand-900))",
        },
        surface: {
          50: "hsl(var(--color-surface-50))",
          100: "hsl(var(--color-surface-100))",
          200: "hsl(var(--color-surface-200))",
          300: "hsl(var(--color-surface-300))",
          400: "hsl(var(--color-surface-400))",
          500: "hsl(var(--color-surface-500))",
          600: "hsl(var(--color-surface-600))",
          700: "hsl(var(--color-surface-700))",
          800: "hsl(var(--color-surface-800))",
          900: "hsl(var(--color-surface-900))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      spacing: {
        18: "var(--space-16)",
        ds1: "var(--space-1)",
        ds2: "var(--space-2)",
        ds3: "var(--space-3)",
        ds4: "var(--space-4)",
        ds5: "var(--space-5)",
        ds6: "var(--space-6)",
        ds8: "var(--space-8)",
        ds10: "var(--space-10)",
        ds12: "var(--space-12)",
        ds16: "var(--space-16)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "var(--radius-xs)",
        ds: "var(--radius-md)",
        panel: "var(--radius-lg)",
        frame: "var(--radius-xl)",
      },
      boxShadow: {
        glass: "var(--shadow-glass)",
        elevated: "var(--shadow-elevated)",
        card: "var(--shadow-card)",
      },
      transitionDuration: {
        fast: "var(--motion-fast)",
        base: "var(--motion-base)",
        slow: "var(--motion-slow)",
      },
      zIndex: {
        base: "var(--z-base)",
        raised: "var(--z-raised)",
        overlay: "var(--z-overlay)",
        modal: "var(--z-modal)",
        toast: "var(--z-toast)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
