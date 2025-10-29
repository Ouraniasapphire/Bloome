import { createSignal, createContext, useContext, onMount, JSX } from 'solid-js';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
    theme: () => Theme;
    isDark: () => boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>();

export function ThemeProvider(props: { children: JSX.Element }) {
    const [theme, setTheme] = createSignal<Theme>('light');
    const isDark = () => theme() === 'dark';

    onMount(() => {
        let saved = localStorage.getItem('theme') as Theme | null;
        if (!saved) {
            saved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            localStorage.setItem('theme', saved);
        }
        setTheme(saved);
        document.documentElement.classList.toggle('dark', saved === 'dark');
    });

    const toggleTheme = () => {
        const newTheme = isDark() ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        localStorage.setItem('theme', newTheme);
    };

    const value: ThemeContextValue = {
        theme,
        isDark,
        toggleTheme,
    };

    return <ThemeContext.Provider value={value}>{props.children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
}
