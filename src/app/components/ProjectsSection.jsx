"use client";
import React, {useRef} from 'react';
import ProjectCard from './ProjectCard';
import {animate, motion, useInView} from "framer-motion";

const PROJECTS_DATA = [
  {
    id: 1,
    title: "WeatherApp",
    description: "NextJS app using Weather API to fetch data and stores user's favourite locations in LocalStorage.",
    link: "https://github.com/KodaAllison/weatherapp",
  },
  {
    id: 2,
    title: "FiveSomewhere",
    description: "React app with MongoDB that finds global locations where it's currently 5pm.",
    link: "https://github.com/KodaAllison/five-somewhere",
  },
  {
    id: 3,
    title: "Start-Bench-Sell",
    description: "NextJS app that generates 3 football players daily where users decide which to Start, Bench, and Sell. Built with my dad's help.",
    link: "https://start-bench-sell.vercel.app",
  },
  {
    id: 4,
    title: "CC-Centre",
    description: "Complete website redesign for a local community centre with SendGrid Email API integration. Full development cycle experience working with a real client.",
    link: "https://cc-centre.org",
  },
  {
    id: 5,
    title: "SwiftPlan",
    description: "Full-stack Next.js app for teachers to generate AI-powered lesson plans. Built for my dissertation with NextAuth, Prisma/PostgreSQL, and OpenAI integration.",
    link: "https://github.com/KodaAllison/SwiftPlan",
  },
];

export const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {once: true});
  const cardVariants = {
    inital: {y:50, opacity: 0},
    animate: {y: 0, opacity: 1},
  };

  return (
    <section id='projects' ref={ref}>
      <h2 className='text-center text-3xl font-bold m-4 text-slate-900 dark:text-white'>My Projects</h2>
      <ul className='grid md:grid-cols-3 gap-8 md:gap-12'>
        {PROJECTS_DATA.map((project) => (
          <motion.li variants={cardVariants} initial="inital" animate={isInView ? "animate" : "inital"} transition={{duration: 0.3, delay: project.id*0.4}}  key={project.id}>
            <ProjectCard  
            title={project.title} 
            description={project.description} 
            gitUrl={project.link}/>
          </motion.li>
        ))} 
          
      </ul>
    
    </section>
      
  );
};

export default ProjectsSection;
