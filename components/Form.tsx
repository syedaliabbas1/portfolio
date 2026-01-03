"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Message sent successfully! I'll get back to you soon.");
        setFormData({ name: "", email: "", company: "", message: "" });
      } else {
        toast.error(data.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="contact"
      className="bg-[#111] bg-opacity-80 backdrop-blur-xl py-12 sm:py-16 rounded-3xl mt-2"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 mb-12">
          <p className="text-base font-semibold leading-7 text-[#999]">
            Get In Touch
          </p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Let's Build Something Impactful
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            I'm actively seeking internship opportunities, industrial
            placements, and research collaborations in AI systems, applied
            machine learning, and robotics. Drop me a message and let's discuss
            how we can work together.
          </p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="mx-auto max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-white mb-2"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full rounded-lg bg-[#1a1a1a] border border-[#333] px-4 py-3 text-base text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all"
                placeholder="Your full name"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-white mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-lg bg-[#1a1a1a] border border-[#333] px-4 py-3 text-base text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="company"
                className="block text-sm font-semibold text-white mb-2"
              >
                Company / Organization (Optional)
              </label>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                className="block w-full rounded-lg bg-[#1a1a1a] border border-[#333] px-4 py-3 text-base text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all"
                placeholder="Your company or university"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="block text-sm font-semibold text-white mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                value={formData.message}
                onChange={handleChange}
                className="block w-full rounded-lg bg-[#1a1a1a] border border-[#333] px-4 py-3 text-base text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all resize-none"
                placeholder="Tell me about your project, opportunity, or how we can collaborate..."
              />
            </div>
          </div>

          <div className="mt-8">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-lg bg-white px-6 py-4 text-base font-semibold text-black shadow-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#111] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </motion.button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            You can also reach me directly at{" "}
            <a
              href="mailto:syedaliabbas1124@gmail.com"
              className="font-semibold text-white hover:text-gray-300 transition-colors"
            >
              syedaliabbas1124@gmail.com
            </a>
          </p>
        </motion.form>
      </div>
    </div>
  );
}
