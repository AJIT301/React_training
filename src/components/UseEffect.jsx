import { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/UseEffect.css';
import { useLocalStorage } from '../hooks/useLocalStorage';
import AutoSaveCheckboxNoHook from './AutoSaveCheckboxNoHook';
import AutoEqualHeightGrid from './helpers/just2boxes';



export default function UseEffect() {

    const [title, setTitle] = useState("React useEffect Examples");
    const [isTyping, setIsTyping] = useState(false); // New: tracks typing state
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const [completed, setCompleted, storageStatus] = useLocalStorage('useEffectCompleted', false);
    const isInitialTitleLoad = useRef(true); // Ref for title effect

    const handleMove = useCallback((e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
        // console.log("mouse moved", e.clientX, e.clientY)
        // Clear existing timer
        if (window.mouseResetTimer) {
            clearTimeout(window.mouseResetTimer);
            // console.log(e.clientX, e.clientY, "mouse cleared")
        }

        // Set new timer to reset after 1 second of inactivity
        window.mouseResetTimer = setTimeout(() => {
            setMousePos({ x: 0, y: 0 });
        }, 500);
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMove);

        return () => {
            window.removeEventListener('mousemove', handleMove);
            if (window.mouseResetTimer) {
                clearTimeout(window.mouseResetTimer);
            }
            setMousePos({ x: 0, y: 0 }); // Reset on unmount
        };
    }, [handleMove]);



    useEffect(() => {
        if (isInitialTitleLoad.current) {
            isInitialTitleLoad.current = false; // Skip on first render
            return;
        }

        // Only set "typing" if this is a user-initiated change (not initial mount)
        setIsTyping(true);

        const timer = setTimeout(() => {
            document.title = title;
            setIsTyping(false);
            console.log("✅ Title updated:", title);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [title]);

    return (
        <div className="ue-container">
            <h1>useEffect Examples</h1>

            {/* EXAMPLE 1 */}
            <div className="ue-example-box ue-example-1">
                <h3>1. Update Document Title (Debounced)</h3>
                <p>Current title: <strong>{document.title}</strong></p>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Type to change document title"
                    className="ue-input"
                />
                {/* New: Typing status indicator */}
                <div className="ue-typing-status">
                    {isTyping ? (
                        <span className="ue-typing-active">⏳ User typing... timer prolonged</span>
                    ) : (
                        <span className="ue-typing-idle">✅ User stopped typing — title updated</span>
                    )}
                </div>
                <p className="ue-note">✅ Waits 500ms after typing stops → updates title.</p>
            </div>

            {/* EXAMPLE 2 */}
            <div className="ue-example-box ue-example-2">
                <h3>2. Mouse Position Tracker</h3>
                <p>Mouse position: X: {mousePos.x}, Y: {mousePos.y}</p>
                <p className="ue-note">✅ Uses cleanup — removes event listener on unmount.</p>
            </div>



            {/* EXAMPLE 3 */}
            <AutoEqualHeightGrid>
                <div className="ue-example-box ue-example-3">
                    <h3>3. Auto-Save State to localStorage</h3>
                    <label>
                        <input
                            type="checkbox"
                            checked={completed}
                            onChange={(e) => setCompleted(e.target.checked)}
                            className="ue-checkbox"
                        />
                        Mark as completed
                    </label>
                    <div className="ue-status-message">
                        {storageStatus && <p><strong>Status:</strong> {storageStatus}</p>}
                    </div>
                    <p className="ue-note">✅ Saves to localStorage when checkbox changes. Loads on refresh.</p>
                </div>
                {/* Right-side mirror (no hook) */}
                <AutoSaveCheckboxNoHook />

            </AutoEqualHeightGrid>
            <hr className="ue-hr" />

            {/* KEY TAKEAWAYS */}
            <div className="ue-takeaways-box">
                <h3>💡 Key Takeaways</h3>
                <ul>
                    <li><strong>Empty deps <code>[]</code></strong> → run once (mount)</li>
                    <li><strong>Include deps</strong> → if you use a value inside the effect</li>
                    <li><strong>Always cleanup</strong> → timers, listeners, subscriptions</li>
                    <li><strong>Don’t include state</strong> you’re updating via functional update</li>
                    <li><strong>Debounce</strong> → reset timer on every change → act after pause</li>
                </ul>
            </div>
        </div>
    );
}
