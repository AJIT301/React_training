import { useContext } from 'react';
import { WidgetContext } from './WidgetContext';

// Custom hook to use the WidgetContext
export const useWidgetContext = () => {
    const context = useContext(WidgetContext);
    if (!context) {
        throw new Error('useWidgetContext must be used within a WidgetProvider');
    }
    return context;
};
