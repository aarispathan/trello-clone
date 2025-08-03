/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';

export const BoardContext = createContext();

const LOCAL_STORAGE_KEY = 'trello-clone-board-data';

const defaultBoard = {
    active: 0,
    boards: [
        {
            name: 'My Board',
            bgcolor: '#1d1f22',
            list: []
        }
    ]
};

export const BoardProvider = ({ children }) => {
    const [allboard, setAllBoard] = useState(() => {
        try {
            const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
            return stored ? JSON.parse(stored) : defaultBoard;
        } catch (e) {
            console.error('Failed to load board data from localStorage:', e);
            return defaultBoard;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allboard));
        } catch (e) {
            console.error('Failed to save board data to localStorage:', e);
        }
    }, [allboard]);

    return (
        <BoardContext.Provider value={{ allboard, setAllBoard }}>
            {children}
        </BoardContext.Provider>
    );
};
