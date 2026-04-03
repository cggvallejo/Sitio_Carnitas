import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';

const ProcessModal = ({ isOpen, progress, logs, title, status, onClose }) => {
    const logEndRef = useRef(null);

    useEffect(() => {
        if (logEndRef.current) {
            logEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-[#121212] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-orange-500/10 to-transparent">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-2xl">
                                {status === 'loading' ? (
                                    <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                                ) : status === 'success' ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                ) : (
                                    <AlertCircle className="w-6 h-6 text-red-500" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                                <p className="text-white/40 text-sm italic">
                                    {status === 'loading' ? 'Procesando cambios...' : 'Proceso finalizado'}
                                </p>
                            </div>
                        </div>
                        {status !== 'loading' && (
                            <button 
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Progress Bar Area */}
                    <div className="p-8 space-y-6">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-white/60 font-semibold uppercase tracking-widest text-xs">Estado del Sistema</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-orange-500">{progress}%</span>
                            </div>
                        </div>
                        <div className="h-4 w-full bg-white/5 rounded-2xl overflow-hidden p-1 border border-white/5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)] relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                            </motion.div>
                        </div>
                    </div>

                    {/* Terminal / Logs Area */}
                    <div className="px-8 pb-8 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3 text-xs text-white/40 uppercase tracking-widest font-bold">
                                <span className="p-1 px-2 bg-white/5 rounded border border-white/10 flex items-center gap-1.5">
                                    <Terminal className="w-3 h-3" />
                                    Consola de Salida
                                </span>
                            </div>
                        </div>
                        <div className="bg-[#0a0a0a] rounded-2xl p-5 h-56 overflow-y-auto font-mono text-sm border border-white/5 scrollbar-thin scrollbar-thumb-white/10 group">
                            {logs.map((log, index) => (
                                <div key={index} className={`mb-2 font-medium leading-relaxed flex gap-3 ${
                                    log.type === 'error' ? 'text-red-400' : 
                                    log.type === 'success' ? 'text-green-400' : 
                                    log.type === 'info' ? 'text-blue-400' : 'text-white/70'
                                }`}>
                                    <span className="text-white/10 select-none">{index + 1}</span>
                                    <span>
                                        <span className="text-white/20 mr-2 text-xs">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                                        {log.message}
                                    </span>
                                </div>
                            ))}
                            {status === 'loading' && (
                                <div className="flex items-center gap-3 text-orange-500/60 mt-4 px-2 py-2 bg-orange-500/5 rounded-lg border border-orange-500/10 active-log">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-xs uppercase tracking-tighter">Esperando respuesta del servidor de Git...</span>
                                </div>
                            )}
                            <div ref={logEndRef} />
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 bg-white/5 border-t border-white/5 flex justify-end gap-4">
                         {status === 'error' && (
                            <button
                                onClick={onClose}
                                className="px-6 py-3 rounded-2xl font-bold bg-white/5 text-white/60 hover:bg-white/10 transition-all active:scale-95 border border-white/5"
                            >
                                Cerrar y revisar
                            </button>
                        )}
                        <button
                            disabled={status === 'loading'}
                            onClick={onClose}
                            className={`px-10 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 group ${
                                status === 'loading' 
                                ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5' 
                                : status === 'success' 
                                    ? 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_20px_rgba(22,163,74,0.3)] active:scale-95'
                                    : 'bg-orange-500 hover:bg-orange-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] active:scale-95'
                            }`}
                        >
                            {status === 'loading' ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Procesando...
                                </>
                            ) : status === 'success' ? (
                                'Completado'
                            ) : 'Continuar'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ProcessModal;
