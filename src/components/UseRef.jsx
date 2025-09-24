// src/components/UseRef.jsx
import { useRef, useState } from 'react';
import '../styles/useRef.css'; // Import the CSS file

export default function UseRef() {
    // Example 1: Persistent counter (no re-render on increment)
    const clickCountRef = useRef(0);
    const [displayCount, setDisplayCount] = useState(0);
    const [countHistory, setCountHistory] = useState([]);
    // Example 2: Accessing a dynamic collection of DOM elements
    const elementsRef = useRef(new Map());
    const [selector, setSelector] = useState('');
    
    // Example 3: Storing a mutable value (previous state simulation)
    const previousDisplayCountRef = useRef(displayCount); // Initialize with current state

    // --- Example 1 Functions ---
    const handleClick = () => {
        clickCountRef.current += 1;
        console.log("Internal Click Count:", clickCountRef.current);
        // Update the ref for previous value tracking
        // This will be updated when the count is shown, to reflect the *previous displayed* value.
    };
    const showCount = () => {
        const newCount = clickCountRef.current;
        // Store the *current* displayed value before we update it.
        previousDisplayCountRef.current = displayCount;
        // Update the state for the new count
        setDisplayCount(newCount);
        // Add the new count to our history ONLY if it's different from the last one.
        setCountHistory(prevHistory => {
            const lastCountInHistory = prevHistory[prevHistory.length - 1];
            if (newCount !== lastCountInHistory) {
                console.log(`History updated with new count: ${newCount}`);
                return [...prevHistory, newCount];
            }
            // If the count is the same, return the existing history without changes.
            return prevHistory;
        });
        console.log(`Show Count clicked. Displaying: ${newCount}.`);
    };

    const resetCount = () => {
        clickCountRef.current = 0;
        setDisplayCount(0);
        previousDisplayCountRef.current = 0; // Reset previous value too
        setCountHistory([]); // Also clear the history
        console.log("Counter reset");
    };

    // --- Example 2 Functions ---
    const handleDynamicAction = () => {
        const node = elementsRef.current.get(selector);
        if (!node) {
            alert(`Element with key "${selector}" not found!`);
            return;
        }

        // Clear previous highlights
        elementsRef.current.forEach(element => {
            element.classList.remove('highlighted');
        });

        // Perform action based on element type
        if (node.tagName === 'INPUT') {
            node.focus();
            node.classList.add('highlighted');
            console.log(`Focused and highlighted <input> with key: "${selector}"`);
        } else if (node.tagName === 'P') {
            node.classList.add('highlighted');
            console.log(`Highlighted <p> with key: "${selector}"`);
            // Scroll to the element
            node.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };


    // --- Example 3: Show previous state value ---
    const showPreviousCount = () => {
        alert(`Previous displayed count was: ${previousDisplayCountRef.current}`);
        // Or update state to show it
        // setDisplayCount(prev => { previousDisplayCountRef.current = prev; return prev; });
        // The ref is updated in handleClick and showCount.
    };

    return (
        <div className="ur-container">
            <h1 className="ur-title">useRef Examples</h1>

            {/* Example 1: Persistent Value */}
            <div className="ur-example-box ur-example-1">
                <h2>1. Persistent Value (No Re-renders)</h2>
                <p>
                    This example uses <code>useRef</code> to store a click count that does <strong>not</strong> cause the component to re-render on every click.
                    Clicking "Click Me" updates the internal ref value. The displayed count below only updates when you click "Show Count".
                </p>

                <div className="ur-button-group">
                    <button onClick={handleClick} className="ur-button ur-button-primary">
                        Click Me (No Re-render)
                    </button>
                    <button onClick={showCount} className="ur-button ur-button-secondary">
                        Show Count
                    </button>
                    <button onClick={resetCount} className="ur-button ur-button-danger">
                        Reset Count
                    </button>
                    <button onClick={showPreviousCount} className="ur-button ur-button-info">
                        Show Previous Count
                    </button>
                </div>

                <div className="ur-display-area">
                    <strong>Displayed Count:</strong> <span id="display-count">{displayCount}</span>
                </div>

                <div className="ur-display-area">
                    <strong>Previous Displayed Count (from last render/update):</strong> <span id="previous-display-count">{previousDisplayCountRef.current}</span>
                </div>


                <div className="ur-display-area">
                    <strong>Count History:</strong>
                    <div className="ur-history-list">
                        {countHistory.length > 0 ? countHistory.join(' → ') : 'No history yet. Click "Show Count".'}
                    </div>
                </div>
                <p className="ur-note"><em>Open the browser console to see logs for each click and reset.</em></p>
            </div>

            {/* Example 2: Accessing DOM */}
            <div className="ur-example-box ur-example-2">
                <h2>2. Accessing DOM Elements</h2>
                <p>
                    <code>useRef</code> can be used to directly access and interact with DOM nodes.
                    Here, we use a single ref to hold a <code>Map</code> of multiple elements.
                    You can select an element by its key and then interact with it.
                </p>

                <div className="ur-dom-example">
                    <strong>Selector:</strong>
                    <input
                        type="text"
                        value={selector}
                        onChange={(e) => setSelector(e.target.value)}
                        placeholder="Enter input1, text1, etc."
                        className="ur-input"
                    />
                    <button onClick={handleDynamicAction} className="ur-button ur-button-primary">
                        Focus or Highlight
                    </button>
                </div>

                <div className="ur-dom-grid">
                    <div className="ur-dom-item">
                        <h4>Input 1 (key: <code>input1</code>)</h4>
                        <input
                            ref={(node) => node ? elementsRef.current.set('input1', node) : elementsRef.current.delete('input1')}
                            type="text"
                            placeholder="I am input1"
                            className="ur-input"
                        />
                    </div>
                    <div className="ur-dom-item">
                        <h4>Input 2 (key: <code>input2</code>)</h4>
                        <input
                            ref={(node) => node ? elementsRef.current.set('input2', node) : elementsRef.current.delete('input2')}
                            type="text"
                            placeholder="I am input2"
                            className="ur-input"
                        />
                    </div>
                    <div className="ur-dom-item">
                        <h4>Text 1 (key: <code>text1</code>)</h4>
                        <p ref={(node) => node ? elementsRef.current.set('text1', node) : elementsRef.current.delete('text1')} className="ur-paragraph">
                            This is the first block of text. You can highlight me by typing "text1" in the selector.
                        </p>
                    </div>
                    <div className="ur-dom-item">
                        <h4>Text 2 (key: <code>text2</code>)</h4>
                        <p ref={(node) => node ? elementsRef.current.set('text2', node) : elementsRef.current.delete('text2')} className="ur-paragraph">
                            This is the second block of text, available to be highlighted by typing "text2".
                        </p>
                    </div>
                </div>
            </div>

            {/* Example 3: Mutable Value (basic) */}
            <div className="ur-example-box ur-example-3">
                <h2>3. Mutable Value (Simulating Previous State)</h2>
                <p>
                    <code>useRef</code> holds a mutable value (<code>.current</code>) that persists across renders.
                    It's often used to store values needed in useEffect or event handlers that reflect the *latest* value,
                    unlike props/state which are captured by closures at render time.
                    Here, we use it to track the value of <code>displayCount</code> from the previous render/update.
                </p>
                <p className="ur-note"><em>Click "Show Previous Count" button above.</em></p>
                {/* The display for previous count is in Example 1 for context */}
            </div>

            {/* Key Takeaways */}
            <div className="ur-takeaways-box">
                <h3>Key Takeaways</h3>
                <ul>
                    <li><strong>Persistent Values:</strong> <code>useRef(initialValue)</code> returns an object <code>&#123; current: initialValue &#125;</code> that persists across renders.</li>
                    <li><strong>No Re-renders:</strong> Changing <code>ref.current</code> does <strong>not</strong> trigger a component re-render.</li>
                    <li><strong>DOM Access:</strong> Pass a ref to a JSX element's <code>ref</code> attribute to get direct access to the DOM node.</li>
                    <li><strong>Mutable Reference:</strong> Useful for storing values needed in timeouts, intervals, or refs that need the latest value.</li>
                    <li><strong>Previous State:</strong> Often combined with <code>useEffect</code> to store the previous value of a prop or state variable.</li>
                </ul>
            </div>
        </div>
    );
}
