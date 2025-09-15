// AppContext.js
import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [history, setHistory] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);

    // Load history and bookmarks from localStorage on startup
    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem("projectHistory")) || [];
        setHistory(savedHistory);

        const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
        setBookmarks(savedBookmarks);
    }, []);

    // Save history whenever it updates
    useEffect(() => {
        localStorage.setItem("projectHistory", JSON.stringify(history));
    }, [history]);

    // Save bookmarks whenever it updates
    useEffect(() => {
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }, [bookmarks]);

    return (
        <AppContext.Provider value={{ history, setHistory, bookmarks, setBookmarks }}>
            {children}
        </AppContext.Provider>
    );
};
