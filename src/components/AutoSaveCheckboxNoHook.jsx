import { useState, useRef, useImperativeHandle, forwardRef } from "react";

const AutoSaveCheckboxNoHook = forwardRef((props, ref) => {
    // helper functions are scoped to this component
    const getCompleted = () => {
        const saved = localStorage.getItem("useEffectCompleted");
        return saved !== null ? JSON.parse(saved) : false;
    };

    const saveCompleted = (value) => {
        localStorage.setItem("useEffectCompleted", JSON.stringify(value));
        return `Saved value '${value}' to localStorage.`;
    };

    const [completed, setCompleted] = useState(getCompleted());
    const [status, setStatus] = useState(() => {
        const saved = localStorage.getItem("useEffectCompleted");
        return saved !== null
            ? `Entry 'useEffectCompleted' exists in localStorage with value: ${saved}`
            : "";
    });

    const handleChange = (e) => {
        const value = e.target.checked;
        setCompleted(value);
        setStatus(saveCompleted(value));
    };

    // Ref to the actual box div
    const boxRef = useRef();

    // Expose this ref to the parent
    useImperativeHandle(ref, () => boxRef.current);

    return (
        <div className="ue-example-box ue-example-3b" ref={boxRef}>
            <h3>3b. Auto-Save (No Hook)</h3>
            <label>
                <input
                    type="checkbox"
                    checked={completed}
                    onChange={handleChange}
                    className="ue-checkbox"
                />
                Mark as completed
            </label>
            <div className="ue-status-message">
                {status && <p><strong>Status:</strong> {status}</p>}
            </div>
            <p className="ue-note">
                ✅ Loads on refresh, saves on toggle. No custom hook used.
            </p>
        </div>
    );
});

export default AutoSaveCheckboxNoHook;
