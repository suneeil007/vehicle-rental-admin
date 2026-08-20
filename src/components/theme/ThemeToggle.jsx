import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            title={
                theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            }
            className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                border
                border-gray-200
                bg-white
                text-gray-700
                transition
                hover:bg-gray-100
                dark:border-gray-700
                dark:bg-gray-900
                dark:text-gray-200
                dark:hover:bg-gray-800
            "
        >
            {theme === "dark" ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
        </button>
    );
};

export default ThemeToggle;