import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";

import queryClient from "./app/services/queryClient";

import App from "./App";

import "./index.css";

import { Toaster } from "sonner";

import { ThemeProvider } from "./components/theme/ThemeProvider";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <App />

                <Toaster
                    richColors
                    position="top-right"
                />
            </ThemeProvider>
        </QueryClientProvider>
    </StrictMode>
);