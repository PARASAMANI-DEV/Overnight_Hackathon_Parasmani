
import React from 'react';
import { Shield, Activity, Lock, Globe, Zap, Server, ChevronRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onLaunch: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent)] opacity-40"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20">
              <Shield className="text-white" size={20} />
            </div>
            <span className="font-bold text-xl tracking-wider text-white">SENTINEL</span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-cyan-400 transition-colors">Platform</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Solutions</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Docs</a>
          </div>

          <div className="flex items-center space-x-4">
             <button className="hidden md:block text-slate-300 hover:text-white font-medium text-sm transition-colors">
               Sign In
             </button>
             <button 
                onClick={onLaunch}
                className="px-5 py-2.5 bg-slate-100 text-slate-900 rounded-lg font-semibold text-sm hover:bg-white transition-all hover:scale-105 active:scale-95 flex items-center"
             >
                Launch Console <ChevronRight size={16} className="ml-1" />
             </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-mono mb-8"
          >
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
             </span>
             <span>V2.4 IS LIVE: QUANTUM ENCRYPTION READY</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 leading-tight"
          >
            Securing the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Digital Frontier</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Sentinel provides military-grade real-time threat detection, automated intrusion prevention, and deep-packet inspection for enterprise networks.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4"
          >
            <button 
              onClick={onLaunch}
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-white text-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform hover:-translate-y-1 flex items-center justify-center"
            >
               <Play size={20} className="mr-2 fill-white" /> Start Free Trial
            </button>
            <button className="w-full md:w-auto px-8 py-4 bg-slate-900 border border-slate-800 rounded-xl font-bold text-slate-300 text-lg hover:bg-slate-800 transition-all">
               View Documentation
            </button>
          </motion.div>

          {/* Abstract UI Preview */}
          <motion.div 
             initial={{ opacity: 0, y: 40, scale: 0.95 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             transition={{ duration: 1, delay: 0.5 }}
             className="mt-20 relative mx-auto max-w-5xl rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-2xl overflow-hidden"
          >
             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950 z-20 pointer-events-none"></div>
             <div className="p-4 border-b border-slate-800 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-4 px-3 py-1 bg-slate-950 rounded text-xs text-slate-500 font-mono w-64">sentinel-dashboard.sys</div>
             </div>
             <img 
               src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop" 
               alt="Dashboard Preview" 
               className="w-full h-auto opacity-50 mix-blend-luminosity"
             />
             <div className="absolute inset-0 flex items-center justify-center z-30">
                <button onClick={onLaunch} className="px-6 py-3 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-lg backdrop-blur-md font-mono hover:bg-cyan-500/30 transition-all animate-pulse">
                   CLICK TO INITIALIZE DEMO
                </button>
             </div>
          </motion.div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="py-24 px-6 border-t border-slate-900 bg-slate-950">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-white mb-4">Fortified Intelligence</h2>
               <p className="text-slate-400">Advanced heuristics designed for modern threat vectors.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { icon: Zap, title: "Real-time Processing", desc: "Analyze packet streams with sub-millisecond latency using our proprietary WASM engine." },
                 { icon: Lock, title: "Zero Trust Architecture", desc: "Every request is verified. Identity and context are continuously validated." },
                 { icon: Globe, title: "Global Threat Map", desc: "Visualize attack vectors geographically with our interactive WebGL globe." },
                 { icon: Activity, title: "Anomaly Detection", desc: "AI-driven baselining automatically flags deviations in traffic patterns." },
                 { icon: Server, title: "Edge Deployment", desc: "Run Sentinel on-premise or at the edge. Kubernetes ready out of the box." },
                 { icon: Shield, title: "Compliance Ready", desc: "SOC2 Type II, HIPAA, and GDPR compliant logging and retention policies." },
               ].map((feature, i) => (
                 <div key={i} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 transition-all group hover:bg-slate-900">
                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 text-cyan-500 group-hover:scale-110 transition-transform">
                       <feature.icon size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
           <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield size={16} />
              <span className="font-semibold text-slate-300">SENTINEL SYSTEMS</span>
           </div>
           <div className="flex space-x-6">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Security</a>
              <a href="#" className="hover:text-white">Status</a>
           </div>
           <div className="mt-4 md:mt-0 font-mono">
              © 2024 Sentinel Inc.
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
