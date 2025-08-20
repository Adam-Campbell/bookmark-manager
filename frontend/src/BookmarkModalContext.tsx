import { createContext, useContext, useState } from "react";

const BookmarkModalContext = createContext<{
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}>({
    isOpen: false,
    openModal: () => {},
    closeModal: () => {},
});

export const BookmarkModalProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <BookmarkModalContext.Provider
            value={{ isOpen, openModal, closeModal }}
        >
            {children}
        </BookmarkModalContext.Provider>
    );
};

export const useBookmarkModal = () => {
    const ctx = useContext(BookmarkModalContext);
    if (!ctx) {
        throw new Error(
            "useBookmarkModal must be used within a BookmarkModalProvider"
        );
    }
    return ctx;
};
