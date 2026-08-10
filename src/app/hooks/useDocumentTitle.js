// src/app/hooks/useDocumentTitle.js
import { useEffect } from "react";

const APP_NAME = "Vehicle Rental Admin";

const useDocumentTitle = (title) => {
    useEffect(() => {
        const previousTitle = document.title;

        document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;

        return () => {
            document.title = previousTitle;
        };
    }, [title]);
};

export default useDocumentTitle;