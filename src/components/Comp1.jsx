// src/components/Task1.jsx
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

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
        <div>
            <p>Count: {count}</p>
            <div style={{ height: '24px', display: 'flex', alignItems: 'center' }}>
                <p>{message}</p>
            </div>
            <button
                style={{
                    backgroundColor: count >= 10 ? "#cccccc" : "green",
                    color: count >= 10 ? "#666666" : "white",
                    padding: "8px 16px",
                    margin: "5px",
                    border: "none",
                    borderRadius: "111px",
                    cursor: count >= 10 ? "not-allowed" : "pointer",
                    opacity: count >= 10 ? 0.7 : 1,
                }}
                onClick={handleClick}
                disabled={count >= 10}
            >
                Increment
            </button>
            <button
                style={{
                    backgroundColor: "whitesmoke",
                    color: "black",
                    padding: "8px 16px",
                    margin: "5px",
                    border: "none",
                    borderRadius: "111px",
                    cursor: "pointer",
                }}
                onClick={reset}
            >
                Reset
            </button>
            <button
                style={{
                    backgroundColor: count <= 0 ? "#cccccc" : "red",
                    color: count <= 0 ? "#666666" : "white",
                    padding: "8px 16px",
                    margin: "5px",
                    border: "none",
                    borderRadius: "111px",
                    cursor: count <= 0 ? "not-allowed" : "pointer",
                    opacity: count <= 0 ? 0.7 : 1,
                }}
                onClick={decremental}
                disabled={count <= 0}
            >
                Decrement
            </button>
            {count >= 10 && <Confetti width={window.innerWidth} height={window.innerHeight} />}
        </div>
    );
}