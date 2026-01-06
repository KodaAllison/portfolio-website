"use client";
import React from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="lg:py-10">
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="col-span-7 place-self-center text-center sm:text-left "
        >
          <h1 className="mb-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#DA291C] to-[#FBE122]">
              Hey, I am{" "}
            </span>
            <br />
            <TypeAnimation
              sequence={[
                "Koda",
                3000,
                "A Computer Science Graduate",
                3000,
                "A Software Developer",
                3000,
                "A Fitness Enthusiast",
                3000,
              ]}
              wrapper="span"
              speed={150}
              repeat={Infinity}
            />
          </h1>

          <div className="py-4">
            <a
              href="#contact"
              className="px-6 py-3 rounded-full w-full sm:w-fit mr-4 bg-gradient-to-br from-[#DA291C] to-[#FBE122] hover:brightness-110 text-white block text-center transition"
            >
              Contact Me
            </a>
            <a
              href="/CV.pdf"
              download
              className="px-1 py-1 rounded-full w-full sm:w-fit mr-4 bg-gradient-to-br from-[#DA291C] to-[#FBE122] hover:brightness-110 text-white mt-3 block text-center transition"
            >
              <span className="block rounded-full px-5 py-2 bg-white text-slate-900 hover:bg-slate-100 dark:bg-[#121212] dark:text-white dark:hover:bg-slate-800 transition">
                Download CV
              </span>
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-5 place-self-center mt-4 lg:mt-0"
        >
          <div className="py-4 relative w-[250px] h-[250px] lg:w-[400px] lg:h-[400px]">
            <Image
              src="/profilePhoto.jpg"
              alt="HeadShot"
              className="py-4 rounded-full absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              width={300}
              height={300}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;