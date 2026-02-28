import React from 'react'

/**
 * Premium Loading Screen - Used during initial auth check and large transitions
 * Features a sleek logo animation and a blurred background
 */
const LoadingScreen = ({ message = 'Initializing CodeQuest...' }) => {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0d0d1a]">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>

            {/* Logo & Spinner Container */}
            <div className="relative z-10 flex flex-col items-center">
                <div className="relative size-24 mb-8">
                    {/* Rotating Rings */}
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-2xl"></div>
                    <div className="absolute inset-0 border-t-4 border-primary rounded-2xl animate-spin shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>

                    {/* Inner Logo */}
                    <div className="absolute inset-0 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-4xl font-bold">terminal</span>
                    </div>
                </div>

                {/* Text Content */}
                <h2 className="text-xl font-bold text-white mb-2 tracking-tight">{message}</h2>
                <div className="flex gap-1.5 h-1 items-center">
                    <div className="size-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="size-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="size-1 bg-primary rounded-full animate-bounce"></div>
                </div>
            </div>

            {/* Version Hint */}
            <div className="absolute bottom-8 text-[10px] font-bold text-slate-700 uppercase tracking-[0.3em]">
                Version 1.0.4 Stable
            </div>
        </div>
    )
}

export default LoadingScreen
