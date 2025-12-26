import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { projects, hero, personalInfo } from "@/data/portfolio-data";
import Bio from "@/components/Bio";
import TechMarquee from "@/components/sections/TechMarquee";

export default function Hero() {
  return (
    <div className="min-h-screen">
      {/* Welcome Card */}
      <div className="bg-[#111] bg-opacity-80 backdrop-blur-xl py-6 sm:py-12 rounded-3xl">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <p className="text-base font-semibold leading-7 text-[#999]">
              Hello there!
            </p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              I&apos;m Syed Ali Abbas, a Computer Science student at UCL
            </h2>
          </div>
        </div>
      </div>

      {/* Marquee Section */}
      <TechMarquee logoHeight={48} gap={80} />

      {/* Bio Section */}
      <Bio
        name={personalInfo.name}
        title={personalInfo.title}
        tagline={personalInfo.tagline}
        intro={hero.intro}
        imageSrc="/profile-picture.png"
      />

      {/* Projects Selection Section */}
      <div
        id="#projects"
        className="bg-[#111] bg-opacity-80 backdrop-blur-xl py-6 sm:py-12 rounded-3xl mt-2"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <p className="text-base font-semibold leading-7 text-[#999]">
              2023-2024
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-4xl">
              Featured Projects
            </h2>
            <p className="mt-3 text-lg text-gray-300">
              Flagship projects spanning AI systems, robotics, and full-stack development.
            </p>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      {projects.map((project, index) => (
        <div key={index}>
          <div className="flex flex-col sm:flex-row justify-between space-x-2 mt-2">
            <div className="bg-[#111] bg-opacity-80 backdrop-blur-xl py-6 sm:py-12 rounded-3xl sm:mt-0 w-full sm:w-1/4">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                  <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
                    {project.name}
                  </h2>
                </div>
              </div>
            </div>
            <div className="bg-[#111] bg-opacity-80 backdrop-blur-xl py-6 sm:py-12 rounded-3xl sm:mt-0 w-full sm:w-1/2 mt-2">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                  <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
                    {project.description}
                  </h2>
                  <p className="mt-3 text-lg text-gray-300">{project.stack}</p>

                  <div className="flex justify-between">
                    <div className="mt-7 space-x-2">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-white transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-[#333] group"
                      >
                        <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-[#555] group-hover:h-full"></span>
                        <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            ></path>
                          </svg>
                        </span>
                        <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            ></path>
                          </svg>
                        </span>
                        <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">
                          Launch App
                        </span>
                      </a>

                      <a
                        href={project.github}
                        rel="noreferrer"
                        target="_blank"
                        className="relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-white transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-[#333] group"
                      >
                        <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-[#555] group-hover:h-full"></span>
                        <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                            <path d="M9 18c-4.51 2-5-2-7-2"></path>
                          </svg>
                        </span>
                        <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                            <path d="M9 18c-4.51 2-5-2-7-2"></path>
                          </svg>
                        </span>
                        <span className="flex relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">
                          GitHub Repo
                        </span>
                      </a>
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#111] bg-opacity-80 backdrop-blur-xl py-6 sm:py-12 rounded-3xl mt-2 sm:mt-0 w-full sm:w-1/4">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
                  {/* <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800">
                    Next.js
                  </span> */}

                  {project.badges.map((badge, index) => (
                    <div key={index} className="inline-flex">
                      <motion.span
                        className="items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {badge.name}
                      </motion.span>
                      &nbsp;
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#111] bg-opacity-80 backdrop-blur-xl py-6 sm:py-12 rounded-3xl mt-2">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="scrollbar-hide mt-14 flex w-full snap-x snap-mandatory scroll-px-10 gap-10 overflow-x-scroll scroll-smooth px-10">
                {project.carousel.map((image, index) => (
                  <div
                    key={index}
                    className="md:2/3 relative aspect-[2/3] w-[90%] shrink-0 snap-start snap-always rounded-xl bg-orange-100 sm:w-[44%] md:w-[30%]"
                  >
                    <img
                      src={image.image}
                      alt="image"
                      className="h-full w-full rounded-xl object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
