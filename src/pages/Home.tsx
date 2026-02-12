import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export const Home: React.FC = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [0, window.innerHeight], [20, -20]);
  const rotateY = useTransform(x, [0, window.innerWidth], [-20, 20]);

  function handleMouse(event: React.MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 overflow-hidden relative"
      onMouseMove={handleMouse}
    >
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="z-10 max-w-4xl w-full text-center space-y-8 perspective-1000">
        <motion.div
          style={{ rotateX, rotateY, z: 100 }}
          className="glass-panel p-12 rounded-3xl border border-white/10 shadow-2xl relative"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Nexus Portal
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              The next generation college management platform. Secure, fast, and beautiful.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Login to Portal
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Create Account
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-12 -right-12 w-24 h-24 border-2 border-indigo-500/30 rounded-full border-dashed"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-8 -left-8 w-16 h-16 border-2 border-pink-500/30 rounded-full border-dashed"
          />
        </motion.div>
      </div>
      
      <footer className="absolute bottom-6 text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} Nexus College. All rights reserved.
      </footer>
    </div>
  );
};
