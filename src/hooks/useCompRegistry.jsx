// src/hooks/useCompRegistry.js
import { useState, useCallback, useEffect } from 'react';

export default function useCompRegistry() {
    const [comps, setComps] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load from localStorage on mount
    useEffect(() => {
        const savedComps = localStorage.getItem('comps');
        setIsLoading(true);

        if (savedComps) {
            try {
                const parsedComps = JSON.parse(savedComps);
                // Validate structure
                if (Array.isArray(parsedComps)) {
                    setComps(parsedComps);
                } else {
                    throw new Error("Invalid comp structure");
                }
            } catch (error) {
                console.error("Failed to load comps:", error);
                localStorage.removeItem('comps');
                setComps([]); // reset to empty
            }
        }
        setIsLoading(false);
    }, []);

    // Save to localStorage when comps change
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('comps', JSON.stringify(comps));
        }
    }, [comps, isLoading]);

    const registerComp = useCallback((name, type, description = "") => {
        if (typeof type !== 'string') {
            console.error("❌ registerComp: 'type' must be a string. Got:", type);
            return;
        }

        setComps(prevComps => {
            if (prevComps.some(comp => comp.name === name)) {
                return prevComps;
            }
            return [...prevComps, {
                name,
                isVisible: true,
                type,
                description
            }];
        });
    }, []);

    const toggleComp = useCallback((compName) => {
        setComps(prevComps => {
            return prevComps.map(comp =>
                comp.name === compName
                    ? { ...comp, isVisible: !comp.isVisible }
                    : comp
            );
        });
    }, []);

    return { comps, registerComp, toggleComp, isLoading };
}
