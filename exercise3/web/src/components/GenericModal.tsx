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

const GenericModal: React.FC<GenericModalProps> = ({ title, content, onClose, onSubmit, submitLabel, customClass }) => {
    return (
        <>
            <div onClick={onClose}></div>

            <div>
                <h3>{title}</h3>
                <div>
                    {content}
                </div>

                <div >
                    {onSubmit && submitLabel && (
                        <button
                                onClick={onSubmit}>{submitLabel}
                        </button>
                    )}
                    <button onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </>
    );
};

export default GenericModal;
