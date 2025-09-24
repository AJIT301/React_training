// src/componentsNavModal.jsx

import { useState } from 'react';
import '../styles/NavModal.css';

export default function NavModal({ comps, onToggleComp }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="nav-modal-button"
            >
                ✨
            </button>

            {isOpen && (
                <div className="nav-modal-overlay">
                    <div className="nav-modal-content">
                        <h2>Your Components</h2> {/* Optional: rename header */}
                        <ul className="nav-modal-list">
                            {comps.map((comp) => (
                                <li key={comp.name} className="nav-modal-list-item">
                                    <input
                                        type="checkbox"
                                        checked={comp.isVisible}
                                        onChange={() => onToggleComp(comp.name)}
                                        className="nav-modal-checkbox"
                                    />
                                    <div style={{ cursor: 'pointer', marginLeft: '10px' }}>
                                        <strong>{comp.name}</strong>
                                        {comp.description && (
                                            <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                                                {comp.description}
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="nav-modal-close-button"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}