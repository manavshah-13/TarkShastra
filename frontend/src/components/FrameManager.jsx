import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, MapPin } from 'lucide-react';

const FrameManager = ({ frames, currentFrameIndex: initialIndex = 0 }) => {
  const [currentFrame, setCurrentFrame] = useState(initialIndex);

  const nextFrame = () => {
    if (currentFrame < frames.length - 1) {
      setCurrentFrame(currentFrame + 1);
    }
  };

  const prevFrame = () => {
    if (currentFrame > 0) {
      setCurrentFrame(currentFrame - 1);
    }
  };

  const ActiveComponent = frames[currentFrame].component;

  return (
    <div className="frame-transition-container bg-app-bg h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentFrame}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="h-full w-full overflow-y-auto"
        >
          <ActiveComponent onNext={nextFrame} onPrev={prevFrame} />
        </motion.div>
      </AnimatePresence>

      {/* Development Navigation Overlay (Subtle) */}
      <div className="fixed bottom-6 right-6 flex items-center gap-3 z-[1002] pointer-events-none">
        <div className="pointer-events-auto flex items-center bg-card-bg border border-border-subtle rounded-full shadow-2xl p-1.5 backdrop-blur-xl bg-opacity-80">
          <button 
            onClick={prevFrame}
            disabled={currentFrame === 0}
            className="p-2 text-text-muted hover:text-brand-primary disabled:opacity-20 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="px-3 py-1 flex items-center gap-2 border-x border-border-subtle mx-1">
             <MapPin size={14} className="text-brand-primary" />
             <span className="text-[10px] font-bold font-mono tracking-tighter text-text-primary">
               {String(currentFrame + 1).padStart(2, '0')} / {String(frames.length).padStart(2, '0')}
             </span>
          </div>

          <button 
            onClick={nextFrame}
            disabled={currentFrame === frames.length - 1}
            className="p-2 text-text-muted hover:text-brand-primary disabled:opacity-20 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Top Banner Navigation (Hidden/Contextual) */}
      {currentFrame > 0 && (
         <div className="fixed top-0 left-64 right-0 h-0.5 bg-brand-primary/20 z-[1001]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentFrame + 1) / frames.length) * 100}%` }}
              className="h-full bg-brand-primary shadow-[0_0_10px_var(--primary)]"
            />
         </div>
      )}
    </div>
  );
};

export default FrameManager;
