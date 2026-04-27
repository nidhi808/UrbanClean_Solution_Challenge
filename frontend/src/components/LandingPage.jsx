import React from 'react';
import { ArrowRight, ShieldAlert, Cpu, Map, BarChart3, Leaf } from 'lucide-react';

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 overflow-x-hidden selection:bg-brand-blue/30 relative">
      <div className="ambient-glow-blue top-[0%] left-[-10%] opacity-40"></div>
      <div className="ambient-glow-purple top-[40%] right-[-10%] opacity-40"></div>
      <div className="ambient-glow-green bottom-[-10%] left-[20%] opacity-20"></div>
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ 
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}></div>

      <nav className="relative z-20 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-brand-green to-[#34d399] p-2 rounded-xl text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            <Leaf size={24} className="fill-white/20" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">UrbanClean</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden md:block">Features</a>
          <a href="#about" className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden md:block">Technology</a>
          <div className="btn-neon-container group" onClick={onGetStarted}>
            <button className="btn-neon-content">
              Launch Platform <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32">
        <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-green/30 bg-brand-green/10 text-brand-green text-xs font-bold tracking-widest uppercase mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
            Live YOLOv8 Integration
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-green-100 to-gray-400 tracking-tight leading-tight max-w-4xl mb-6">
            Smart Resource Allocation for Modern Cities
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mb-12">
            Empower your municipality with real-time AI hazard detection. Automatically identify potholes, track resource needs, and dispatch repair teams efficiently.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-24">
            <div className="btn-neon-container group" onClick={onGetStarted}>
              <button className="btn-neon-content px-8 py-4 text-lg">
                Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="btn-neon-container group" style={{ filter: 'hue-rotate(180deg)' }}>
              <a href="#features" className="btn-neon-content px-8 py-4 text-lg !bg-dark-900">
                Explore Features
              </a>
            </div>
          </div>
        </div>

        <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
          <FeatureCard 
            icon={<Cpu size={28} className="text-brand-green" />}
            title="Real-time YOLOv8"
            desc="Advanced neural networks scan incoming video feeds and images to instantly detect urban hazards with 99% accuracy."
            delay="0"
          />
          <FeatureCard 
            icon={<Map size={28} className="text-brand-blue" />}
            title="Precision Geolocation"
            desc="Pinpoint exact hazard locations with reverse geocoding, converting raw coordinates into actionable street addresses."
            delay="100"
          />
          <FeatureCard 
            icon={<ShieldAlert size={28} className="text-brand-purple" />}
            title="Priority Routing"
            desc="AI automatically calculates severity scores and prioritizes cases so critical infrastructure is repaired first."
            delay="200"
          />
          <FeatureCard 
            icon={<BarChart3 size={28} className="text-orange-400" />}
            title="Resource Estimation"
            desc="Predict the exact amount of materials (e.g., asphalt, sealant) required for repairs based on visual spatial analysis."
            delay="300"
          />
        </div>

        {/* --- ABOUT / TECHNOLOGY SECTION --- */}
        <div id="about" className="mt-32 pt-16 border-t border-white/5 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Powered by Cutting-Edge Tech</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Built for the AlumniConneXIE Hackathon, combining robust backend processing with stunning frontend aesthetics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TechCard title="FastAPI & Python" subtitle="AI Inference Backend" tech="YOLOv8 / OpenCV" />
            <TechCard title="React & Vite" subtitle="High-Performance UI" tech="Tailwind CSS / Glassmorphism" />
            <TechCard title="Firebase Suite" subtitle="Cloud Infrastructure" tech="Firestore / Storage / Auth" />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center relative z-10 bg-black/20 backdrop-blur-md">
         <p className="text-gray-500 text-sm">© 2026 UrbanClean Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, delay }) => (
  <div 
    className="group relative p-1 rounded-2xl bg-white/5 hover:bg-transparent transition-all duration-500 overflow-hidden animate-in fade-in slide-in-from-bottom-8"
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
  >
    {/* Animated Neon Border Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-brand-green via-brand-blue to-brand-purple opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
    
    <div className="relative glass-panel p-6 h-full flex flex-col items-start text-left bg-dark-900 group-hover:bg-dark-900/90 transition-colors z-10 border-none m-[1px]">
      <div className="bg-dark-800 p-3 rounded-xl border border-white/5 mb-4 shadow-inner group-hover:scale-110 transition-transform duration-300 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-green transition-colors">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

const TechCard = ({ title, subtitle, tech }) => (
  <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent hover:border-brand-blue/50 transition-colors flex flex-col items-center text-center">
    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
      <Cpu size={24} className="text-gray-300" />
    </div>
    <h4 className="text-xl font-bold text-white mb-1">{title}</h4>
    <p className="text-sm text-gray-400 mb-4">{subtitle}</p>
    <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-mono text-gray-300">{tech}</span>
  </div>
);

export default LandingPage;
