import React from 'react';
import '../styles/App.css';

interface GenericModalProps {
    title: string;
    content: React.ReactNode;
    onClose: () => void;
    onSubmit?: () => void; // Función opcional para submit
    submitLabel?: string;  // Texto del botón de acción
    customClass?: string;
}

const GenericModal: React.FC<GenericModalProps> = ({ title, content, onClose}) => {
    return (
        <>
            <div className="modal">
                <button className="button-close" onClick={onClose}>X</button>
                <h3>{title}</h3>
                <div>
                    {content}
                </div>
            </div>
        </>
    );
};

export default GenericModal;
