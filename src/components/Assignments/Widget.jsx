import { useState, useEffect, useRef } from 'react';

const Widget = ({ widgetId, title, description, defaultToggled = false }) => {
    const storageKey = `widget-state-${widgetId}`;

    // Lazy initialize state from localStorage
    const [isToggled, setIsToggled] = useState(() => {
        const saved = localStorage.getItem(storageKey);

        console.log("Key:", storageKey, "Saved:", saved);

        if (saved !== null) {
            return JSON.parse(saved);
        }
        else {
            return defaultToggled;
        }
        //warcrime way of doing it
        //return saved !== null ? JSON.parse(saved) : defaultToggled;
    });

    const [isSaved, setIsSaved] = useState(false);
    const isInitialMount = useRef(true);

    // Save to localStorage and show "Saved" only on user interaction
    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(isToggled));

        if (!isInitialMount.current) {
            setIsSaved(true);
            const timer = setTimeout(() => setIsSaved(false), 2000);
            return () => clearTimeout(timer);
        } else {
            isInitialMount.current = false;
        }
    }, [isToggled, storageKey]);

    return (
        <div className="as-widget">
            <div style={{ textAlign: 'center' }}>
                <h3>{title}</h3>
                <p>{description}</p>
                <button onClick={() => setIsToggled(!isToggled)}>
                    {isToggled ? 'Disable' : 'Enable'} Feature
                </button>
                <div style={{ height: '24px', marginTop: '1rem' }}>
                    <p className={`as-saved-message ${isSaved ? 'as-saved-message--visible' : ''}`}>
                        Status: Saved
                    </p>
                </div>
            </div>
        </div>
    );
};

// Setting `displayName` is a good practice for debugging. It gives the component a
// descriptive name in React DevTools, which is especially helpful for components
// created with `forwardRef`.
Widget.displayName = 'Widget';
export default Widget;
