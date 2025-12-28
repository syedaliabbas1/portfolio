"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Gallery({ 
  images = [], 
  aspectRatio = "aspect-video" 
}: { 
  images: string[]; 
  aspectRatio?: string 
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  if (!images || images.length === 0) return null;

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    let newIndex = index + newDirection;
    if (newIndex < 0) newIndex = images.length - 1;
    if (newIndex >= images.length) newIndex = 0;
    setIndex(newIndex);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main Image Area */}
      <div className={cn("relative w-full overflow-hidden rounded-2xl bg-gray-900/50 border border-white/10 group", aspectRatio)}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0"
          >
            {/* Blurred background to fill space */}
            <div className="absolute inset-0 z-0">
               <img
                src={images[index]}
                alt=""
                className="h-full w-full object-cover blur-xl opacity-50 scale-110"
              />
            </div>
            
            {/* Main image fully visible */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <img
                src={images[index]}
                alt={`Gallery image ${index + 1}`}
                className="h-full w-full object-contain"
              />
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Arrows (visible on hover) */}
        {images.length > 1 && (
          <>
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-colors"
                aria-label="Previous image"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={(e) => { e.stopPropagation(); paginate(1); }}
                className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-colors"
                aria-label="Next image"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </>
        )}
      </div>
      
      {/* Thumbnails Strip */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 overflow-x-auto pb-2 px-2 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className={cn(
                "relative h-12 w-20 flex-shrink-0 overflow-hidden rounded-md border transition-all duration-300",
                index === i 
                  ? "border-white ring-2 ring-white/20 scale-105 opacity-100" 
                  : "border-transparent opacity-40 hover:opacity-100 grayscale hover:grayscale-0"
              )}
            >
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
