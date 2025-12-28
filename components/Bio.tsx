"use client";

import { motion, useInView } from "framer-motion";
import { PixelImage } from "@/components/ui/pixel-image";
import { useRef } from "react";

interface BioProps {
  name: string;
  title: string;
  tagline: string;
  intro: string;
  imageSrc: string;
}

export default function Bio({ name, title, tagline, intro, imageSrc }: BioProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <div className="bg-[#111] bg-opacity-80 backdrop-blur-xl py-12 rounded-3xl mt-2">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
          {/* Text Content - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="order-2 md:order-1"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-base font-semibold leading-7 text-[#999]"
            >
              About Me
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              {name}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-2 text-lg text-[#999]"
            >
              {title}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="mt-4 text-base font-medium text-white"
            >
              {tagline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="mt-6 text-lg leading-8 text-gray-300"
            >
              {intro.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                    y: 5,
                  }}
                  animate={isInView ? {
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  } : {
                    filter: "blur(10px)",
                    opacity: 0,
                    y: 5,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.7 + 0.02 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>

          {/* Image - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="order-1 md:order-2 flex justify-center md:justify-end"
          >
            <PixelImage
              src={imageSrc}
              grid="6x4"
              grayscaleAnimation={true}
              shouldAnimate={isInView}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
