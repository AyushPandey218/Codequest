import { Link } from 'react-router-dom'

const MaintenancePage = () => {
    return (
        <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center p-6 text-center animate-fade-in relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 space-y-8 max-w-2xl">
                {/* Icon/Logo */}
                <div className="inline-flex items-center justify-center p-6 bg-white/5 rounded-[40px] border border-white/10 shadow-2xl backdrop-blur-xl mb-4 group hover:scale-105 transition-transform duration-500">
                    <span className="material-symbols-outlined text-6xl text-blue-400 group-hover:rotate-12 transition-transform duration-500">construction</span>
                </div>

                <div className="space-y-4">
                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
                        Powering Up <br />
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">CodeQuest</span>
                    </h1>
                    <p className="text-xl text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
                        We're currently performing some scheduled system upgrades to bring you an even more powerful coding experience. 
                    </p>
                </div>

                {/* Progress Visualizer */}
                <div className="w-full max-w-md mx-auto space-y-3">
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-blue-500 rounded-full w-[85%] animate-[pulse_2s_infinite]"></div>
                    </div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                        <span>Optimizing Servers</span>
                        <span>85% Complete</span>
                    </div>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                        to="/auth/login"
                        className="px-8 py-4 bg-white/10 hover:bg-white/15 text-white rounded-2xl font-bold transition-all border border-white/10 backdrop-blur-md flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                        Staff Login
                    </Link>
                    <a 
                        href="mailto:support@codequest.it"
                        className="px-8 py-4 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-2xl font-bold transition-all border border-blue-500/20 flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">mail</span>
                        Contact Support
                    </a>
                </div>

                <p className="text-xs text-slate-600 font-bold uppercase tracking-[0.2em] mt-12">
                    Estimated Availability: Within 30 minutes
                </p>
            </div>
        </div>
    )
}

export default MaintenancePage
