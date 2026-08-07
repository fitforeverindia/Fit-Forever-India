'use client';

import { useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  if (typeof window !== 'undefined') {
    window.onscroll = () => setVisible(window.scrollY > 600);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-6 left-6 z-40"
        >
          <Button
            size="icon"
            aria-label="Scroll to top"
            className="h-11 w-11 rounded-full bg-foreground text-background shadow-lift hover:bg-foreground/90"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
