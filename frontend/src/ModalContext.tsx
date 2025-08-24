import { createContext, useContext, useState } from "react";

type ModalType = "addBookmark" | "addCollection" | null;

const ModalContext = createContext<{
    activeModal: ModalType;
    openModal: (modal: ModalType) => void;
    closeModal: () => void;
}>({
    activeModal: null,
    openModal: () => {},
    closeModal: () => {},
});

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    const openModal = (modal: ModalType) => setActiveModal(modal);
    const closeModal = () => setActiveModal(null);

    return (
        <ModalContext.Provider value={{ activeModal, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const ctx = useContext(ModalContext);
    if (!ctx) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return ctx;
};
