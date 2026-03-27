import React from 'react';
import { createPortal } from 'react-dom';

const ConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = 'Confirm', 
    cancelText = 'Cancel',
    variant = 'danger' // 'danger', 'info', 'warning'
}) => {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            icon: 'error',
            iconColor: 'text-red-400',
            iconBg: 'bg-red-500/10',
            button: 'bg-red-500 hover:bg-red-600 shadow-red-500/20',
            border: 'border-red-500/20'
        },
        warning: {
            icon: 'warning',
            iconColor: 'text-orange-400',
            iconBg: 'bg-orange-500/10',
            button: 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20',
            border: 'border-orange-500/20'
        },
        info: {
            icon: 'info',
            iconColor: 'text-blue-400',
            iconBg: 'bg-blue-500/10',
            button: 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20',
            border: 'border-blue-500/20'
        }
    };

    const style = variantStyles[variant] || variantStyles.info;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" 
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative w-full max-w-md bg-[#12122a] border ${style.border} rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-zoom-in`}>
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${style.iconBg}`}>
                            <span className={`material-symbols-outlined text-3xl ${style.iconColor}`}>
                                {style.icon}
                            </span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{message}</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-white/5 flex items-center justify-end gap-3 px-6">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0 ${style.button}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmationModal;
