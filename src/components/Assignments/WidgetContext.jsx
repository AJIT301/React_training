import { createContext, useState, useEffect, useRef, useCallback } from 'react';

// Create the context
const WidgetContext = createContext();

// Provider component
export const WidgetProvider = ({ children }) => {
    // Registry to hold widget states
    const [widgets, setWidgets] = useState({});
    const isInitialMount = useRef(true);

    // Load initial states from localStorage
    useEffect(() => {
        const loadedWidgets = {};
        for (let i = 1; i <= 3; i++) { // Assuming 3 widgets for now
            const key = `widget-state-${i}`;
            const saved = localStorage.getItem(key);
            loadedWidgets[i] = saved !== null ? JSON.parse(saved) : false;
        }
        setWidgets(loadedWidgets);
        isInitialMount.current = false;
    }, []);

    // Save to localStorage whenever widgets change
    useEffect(() => {
        if (!isInitialMount.current) {
            Object.keys(widgets).forEach(id => {
                localStorage.setItem(`widget-state-${id}`, JSON.stringify(widgets[id]));
            });
        }
    }, [widgets]);

    // Function to toggle a widget
    const toggleWidget = useCallback((id) => {
        setWidgets(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    }, []);

    // Function to reset a widget
    const resetWidget = useCallback((id) => {
        setWidgets(prev => ({
            ...prev,
            [id]: false // Assuming default is false
        }));
    }, []);

    // Function to reset all widgets
    const resetAllWidgets = useCallback(() => {
        setWidgets(prev => {
            const reset = {};
            Object.keys(prev).forEach(id => {
                reset[id] = false;
            });
            return reset;
        });
    }, []);

    // Function to register a widget (add to registry)
    const registerWidget = useCallback((id, defaultState = false) => {
        setWidgets(prev => ({
            ...prev,
            [id]: prev[id] !== undefined ? prev[id] : defaultState
        }));
    }, []);

    const value = {
        widgets,
        toggleWidget,
        resetWidget,
        resetAllWidgets,
        registerWidget
    };

    return (
        <WidgetContext.Provider value={value}>
            {children}
        </WidgetContext.Provider>
    );
};

export { WidgetContext };
