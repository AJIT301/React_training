// src/components/Comp1.jsx
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import '../styles/Comp1.css';

export default function Task1() {
    const [count, setCount] = useState(0);
    const [message, setMessage] = useState("");
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        if (!hasInteracted) return;
        if (count <= 0) {
            setMessage("You reached the bottom of the counter");
        } else if (count >= 10) {
            setMessage("You reached the TOP of the counter: " + count);
        } else {
            setMessage("");
        }
    }, [count, hasInteracted]);

    const handleClick = () => {
        setCount(count + 1);
        setMessage("");
        setHasInteracted(true);
    };

    const reset = () => {
        setCount(0);
        setHasInteracted(false);
        setMessage("You reset to zero");
    };

    const decremental = () => {
        setCount(count - 1);
        setMessage("");
        setHasInteracted(true);
    };

    return (
        <div className="comp1-container">
            <div className="comp1-top-row">
                <p>Count: {count}</p>
                
            </div>
            <div className="comp1-message">
                <p>{message}</p>
            </div>
            <div className="comp1-buttons">
                <button
                    className={`comp1-button comp1-increment ${count >= 10 ? 'comp1-disabled' : ''}`}
                    onClick={handleClick}
                    disabled={count >= 10}
                >
                    Increment
                </button>
                <button
                    className="comp1-button comp1-reset"
                    onClick={reset}
                >
                    Reset
                </button>
                <button
                    className={`comp1-button comp1-decrement ${count <= 0 ? 'comp1-disabled' : ''}`}
                    onClick={decremental}
                    disabled={count <= 0}
                >
                    Decrement
                </button>
            </div>
            {count >= 10 && <Confetti width={window.innerWidth} height={window.innerHeight} />}
        </div>
    );
}
