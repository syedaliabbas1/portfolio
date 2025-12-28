"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Internal component for the pixel animation effect
// Adapted from PixelImage to be fully responsive and fit the gallery container
const PixelTransitionImage = ({ 
  src, 
  alt, 
  className,
  onLoad
}: { 
  src: string; 
  alt: string; 
  className?: string;
  onLoad?: () => void;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const rows = 6;
  const cols = 8;
  
  useEffect(() => {
    setIsMounted(true);
    // Notify parent that image is "ready" if needed, though we rely on CSS transition
    if (onLoad) onLoad();
  }, [onLoad]);

  const pieces = useMemo(() => {
    const total = rows * cols;
    return Array.from({ length: total }, (_, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;

      // Add overlap to prevent visible grid lines
      const overlap = 0.5;
      const clipPath = `polygon(
        ${Math.max(0, col * (100 / cols) - overlap)}% ${Math.max(0, row * (100 / rows) - overlap)}%,
        ${Math.min(100, (col + 1) * (100 / cols) + overlap)}% ${Math.max(0, row * (100 / rows) - overlap)}%,
        ${Math.min(100, (col + 1) * (100 / cols) + overlap)}% ${Math.min(100, (row + 1) * (100 / rows) + overlap)}%,
        ${Math.max(0, col * (100 / cols) - overlap)}% ${Math.min(100, (row + 1) * (100 / rows) + overlap)}%
      )`;

      // Random delay for "pixel rain" effect
      const delay = Math.random() * 600; 
      return { clipPath, delay };
    });
  }, []);

  return (
    <div className={cn("relative w-full h-full", className)}>
      {/* The grid of pixel pieces */}
      {pieces.map((piece, i) => (
        <div
          key={i}
          className={cn(
            "absolute inset-0 w-full h-full transition-opacity duration-700 ease-out",
            isMounted ? "opacity-100" : "opacity-0"
          )}
          style={{
            clipPath: piece.clipPath,
            transitionDelay: `${piece.delay}ms`,
          }}
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-contain pointer-events-none" 
            // object-contain to match the parent requirement
          />
        </div>
      ))}
      
      {/* 
         Optional: A fallback full image that fades in at the very end 
         to ensure no sub-pixel rendering gaps remain.
         We delay it until after the longest possible piece animation (600ms + 700ms).
      */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "absolute inset-0 w-full h-full object-contain transition-opacity duration-500 delay-1000",
          isMounted ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
};

export default function Gallery({ 
  images = [], 
  aspectRatio = "aspect-video",
  autoPlayInterval = 5000
}: { 
  images: string[]; 
  aspectRatio?: string;
  autoPlayInterval?: number;
}) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  if (!images || images.length === 0) return null;

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex < 0) newIndex = images.length - 1;
      if (newIndex >= images.length) newIndex = 0;
      return newIndex;
    });
  }, [images.length]);

  // Auto-play logic
  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      paginate(1);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [index, isPaused, autoPlayInterval, paginate]);

  return (
    <div 
      className="w-full flex flex-col gap-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Image Area */}
      <div className={cn("relative w-full overflow-hidden rounded-2xl bg-gray-900/50 border border-white/10 group", aspectRatio)}>
        {/* 
           We use a key on the AnimatePresence or the inner div to trigger re-mounting.
           For the pixel effect to work "fresh" every time, we need the component to unmount/remount.
           Using `key={index}` ensures this.
        */}
        <div key={index} className="absolute inset-0 w-full h-full">
            {/* Blurred background to fill space */}
            <div className="absolute inset-0 z-0">
               <img
                src={images[index]}
                alt=""
                className="h-full w-full object-cover blur-xl opacity-50 scale-110"
              />
            </div>
            
            {/* Pixel Transition Foreground */}
            <div className="absolute inset-0 z-10">
              <PixelTransitionImage 
                src={images[index]} 
                alt={`Gallery image ${index + 1}`}
              />
            </div>
        </div>
        
        {/* Navigation Arrows (visible on hover) */}
        {images.length > 1 && (
          <>
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              <button 
                onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                className="p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-colors"
                aria-label="Previous image"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
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
              {/* Progress bar for auto-play could go here if requested, but keeping it simple */}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}