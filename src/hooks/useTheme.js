import { useEffect, useState } from "react";

const STORAGE_KEY = "vehicle-rental-theme";

const getInitialTheme = () => {
    const savedTheme = localStorage.getItem(STORAGE_KEY);

    if (
        savedTheme === "light" ||
        savedTheme === "dark" ||
        savedTheme === "system"
    ) {
        return savedTheme;
    }

    return "light";
};

const applyTheme = (theme) => {
    const root = document.documentElement;

    if (theme === "dark") {
        root.classList.add("dark");
        return;
    }

    if (theme === "light") {
        root.classList.remove("dark");
        return;
    }

    // System mode
    const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    root.classList.toggle("dark", prefersDark);
};

export const useTheme = () => {
    const [theme, setThemeState] = useState(getInitialTheme);

    useEffect(() => {
        applyTheme(theme);

        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    useEffect(() => {
        if (theme !== "system") {
            return;
        }

        const mediaQuery = window.matchMedia(
            "(prefers-color-scheme: dark)"
        );

        const handleChange = () => {
            applyTheme("system");
        };

        mediaQuery.addEventListener("change", handleChange);

        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, [theme]);

    const setTheme = (newTheme) => {
        if (
            newTheme !== "light" &&
            newTheme !== "dark" &&
            newTheme !== "system"
        ) {
            return;
        }

        setThemeState(newTheme);
    };

    const toggleTheme = () => {
        setThemeState((currentTheme) => {
            if (currentTheme === "dark") {
                return "light";
            }

            return "dark";
        });
    };

    return {
        theme,
        setTheme,
        toggleTheme,
    };
};