import { useState } from 'react';

/**
 * A custom hook to manage state in localStorage.
 * @param {string} key The key for the localStorage item.
 * @param {*} initialValue The initial value to use if nothing is in localStorage.
 * @returns {[*, function, string]} A stateful value, a function to update it, and a status message.
 */
export function useLocalStorage(key, initialValue) {
    const [status, setStatus] = useState('');

    // Initialize state from localStorage or the initialValue
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (item !== null) {
                const parsedItem = JSON.parse(item);
                setStatus(`Entry '${key}' exists in localStorage with value: ${parsedItem}`);
                return parsedItem;
            } else {
                window.localStorage.setItem(key, JSON.stringify(initialValue));
                setStatus(`No entry found. Created '${key}' in localStorage with default value: ${initialValue}`);
                return initialValue;
            }
        } catch (error) {
            console.error(error);
            setStatus(`Error reading from localStorage. Using default value: ${initialValue}`);
            return initialValue;
        }
    });

    // Create a wrapper for the setter function that also persists to localStorage
    const setValue = (value) => {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        setStatus(`Saved value '${valueToStore}' to localStorage.`);
    };

    return [storedValue, setValue, status];
}