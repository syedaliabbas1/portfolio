"use client";

import React from "react";

import NavLinks from "@/components/NavLinks";
import Header from "@/components/Header";
import Personal from "@/components/Personal";
import Hero from "@/components/Hero";
import ContactForm from "@/components/Form";
import Footer from "@/components/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { Toaster } from "sonner";

export default function Layout() {
  const { scrollY } = useScroll();

  return (
    <div className="min-h-screen ">
      <Toaster position="top-center" richColors />
      <div className="flex justify-between">
        <Personal />
        <div className="space-x-2 mb-2 pt-2 mr-2">
          {/* @ts-ignore */}
          <NavLinks />
        </div>
      </div>

      <motion.div
        className="relative w-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <Header />
      </motion.div>

      <div className="p-2">
        <Hero />
        <ContactForm />
        <Footer />
      </div>
    </div>
  );
}
