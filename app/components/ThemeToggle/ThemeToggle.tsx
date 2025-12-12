import { useTheme } from "~/context/ThemeContext";

const ThemeToggle = () => {

    const { theme, toggleTheme} = useTheme();

    return (
        <button onClick={toggleTheme} className="text-(--surface-0) bg-(--surface-text) px-4 py-2 rounded-lg! border-none! w-full mb-2 mr-4 mt-4 ml-4">
            {theme.toUpperCase()}
        </button>
    )
}

export default ThemeToggle