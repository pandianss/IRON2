import React, { createContext } from 'react';
import { useAppContext } from './AppContext';

const UIFeedbackContext = createContext(null);

export const UIFeedbackProvider = ({ children }) => {
    return (
        <UIFeedbackContext.Provider value={{}}>
            {children}
        </UIFeedbackContext.Provider>
    );
};

export const useUIFeedback = () => {
    // PROXY: Read from legacy AppContext (which gets it from UIContext)
    const {
        toast,
        showToast,
        showModal,
        closeModal,
        activeModal
    } = useAppContext();

    return {
        toast,
        showToast,
        showModal,
        closeModal,
        activeModal
    };
};
