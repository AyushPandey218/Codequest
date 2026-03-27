import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';

const Blip = ({ x, y, color }) => (
    <div 
        className={`absolute size-1.5 rounded-full animate-blip ${color}`}
        style={{ left: `${x}%`, top: `${y}%` }}
    />
);

const TrafficRadar = () => {
    const [blips, setBlips] = useState([]);
    const [logs, setLogs] = useState([]);
    const logEndRef = useRef(null);

    // Initial dummy logs for aesthetic
    useEffect(() => {
        const initialLogs = [
            { id: 1, text: 'SYSTEM_INITIALIZED', type: 'info', time: '0.00ms' },
            { id: 2, text: 'CORE_SYNC_ACTIVE', type: 'success', time: '0.05ms' },
            { id: 3, text: 'RADAR_SCANNING_RANGE_MAX', type: 'info', time: '0.12ms' },
        ];
        setLogs(initialLogs);
    }, []);

    // Listen to real activity (e.g., from notifications or users)
    useEffect(() => {
        const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(5));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const data = change.doc.data();
                    const newLog = {
                        id: change.doc.id,
                        text: `RELAY_${data.type?.toUpperCase() || 'EVENT'}: ${data.title?.substring(0, 20)}...`,
                        type: data.type === 'error' ? 'error' : 'info',
                        time: 'NOW'
                    };
                    
                    setLogs(prev => [...prev.slice(-15), newLog]);
                    
                    // Add a real blip
                    const newBlip = {
                        id: Math.random(),
                        x: 20 + Math.random() * 60,
                        y: 20 + Math.random() * 60,
                        color: data.type === 'error' ? 'bg-red-500' : 'bg-blue-400'
                    };
                    setBlips(prev => [...prev, newBlip]);
                    
                    // Auto-remove blip after animation
                    setTimeout(() => {
                        setBlips(prev => prev.filter(b => b.id !== newBlip.id));
                    }, 2000);
                }
            });
        });

        return () => unsubscribe();
    }, []);

    // Simulated background activity
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                const colors = ['bg-blue-500/40', 'bg-indigo-500/30', 'bg-purple-500/20'];
                const newBlip = {
                    id: Math.random(),
                    x: 10 + Math.random() * 80,
                    y: 10 + Math.random() * 80,
                    color: colors[Math.floor(Math.random() * colors.length)]
                };
                setBlips(prev => [...prev, newBlip]);
                setTimeout(() => {
                    setBlips(prev => prev.filter(b => b.id !== newBlip.id));
                }, 2000);
            }
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    return (
        <div className="lg:col-span-8 bg-[#0b0b1e]/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-8 min-h-[400px]">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 size-64 bg-blue-500/5 blur-[100px] -mr-32 -mt-32"></div>
            
            {/* Radar Circular Section */}
            <div className="relative w-full md:w-1/2 aspect-square max-w-[300px] mx-auto shrink-0 flex items-center justify-center">
                {/* Concentric Circles */}
                <div className="absolute inset-0 border border-white/5 rounded-full"></div>
                <div className="absolute inset-[20%] border border-white/5 rounded-full"></div>
                <div className="absolute inset-[40%] border border-white/5 rounded-full"></div>
                <div className="absolute inset-[60%] border border-white/5 rounded-full"></div>
                
                {/* Axis Lines */}
                <div className="absolute w-full h-[1px] bg-white/5 top-1/2 -translate-y-1/2"></div>
                <div className="absolute h-full w-[1px] bg-white/5 left-1/2 -translate-x-1/2"></div>
                
                {/* The Sweep */}
                <div className="absolute inset-0 rounded-full animate-radar-sweep origin-center overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 w-full h-1/2 bg-gradient-to-tr from-blue-500/20 to-transparent origin-top-left -rotate-90 opacity-40"></div>
                </div>

                {/* Blips */}
                {blips.map(blip => (
                    <Blip key={blip.id} {...blip} />
                ))}

                {/* Center Core */}
                <div className="size-4 bg-blue-500/20 rounded-full border border-blue-500/40 flex items-center justify-center relative shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    <div className="size-1 bg-blue-400 rounded-full animate-ping"></div>
                </div>

                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                    <span className="text-[10px] font-black text-blue-500/50 uppercase tracking-[0.3em]">Traffic Radar</span>
                </div>
            </div>

            {/* Live Activity Console */}
            <div className="flex-1 flex flex-col bg-black/20 rounded-2xl border border-white/5 p-4 overflow-hidden relative">
                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                    <div className="flex items-center gap-2">
                        <div className="size-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[9px] font-black text-green-500/70 uppercase tracking-widest">Live Activity Log</span>
                    </div>
                    <span className="text-[8px] font-mono text-slate-500">ID: relay_ctx_09</span>
                </div>
                
                <div className="flex-1 overflow-y-auto font-mono text-[10px] space-y-1.5 custom-scrollbar pr-2">
                    {logs.map((log, idx) => (
                        <div key={log.id || idx} className="flex gap-3 animate-fade-in opacity-0">
                            <span className="text-slate-600 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                            <span className={`${log.type === 'success' ? 'text-green-400' : log.type === 'error' ? 'text-red-400' : 'text-blue-400'} font-bold`}>
                                {log.text}
                            </span>
                        </div>
                    ))}
                    <div ref={logEndRef} />
                </div>
                
                <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#0b0b1e]/60 to-transparent pointer-events-none"></div>
            </div>
        </div>
    );
};

export default TrafficRadar;
