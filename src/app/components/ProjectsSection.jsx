"use client";
import React, {useRef} from 'react';
import ProjectCard from './ProjectCard';
import {animate, motion, useInView} from "framer-motion";

const PROJECTS_DATA = [
  {
    id: 1,
    title: "WeatherApp",
    description: "Basic NextJS app, uses Weather API to fetch data and stores users favourite locations in LocalStorage ",
    image: "/weather.png",
    link: "https://github.com/KodaAllison/weatherapp",
  },
  {
    id: 2,
    title: "FiveSomewhere",
    description: "React App uses MongoDB to store data on various gloabal locations. Only returns locations where it is 5pm in the world",
    image: "/five.png",
    link: "https://github.com/KodaAllison/five-somewhere",
  },
  {
    id: 3,
    title: "Start-Bench-Sell",
    description: "A NextJS app mainly built by my dad but I have offered some assistance and regularly nag him to explain how the code works. The app Generates 3 players daily and users pick which one to Start, Bench and Sell",
    image: "/sbs.png",
    link: "https://start-bench-sell.vercel.app",
  },
  {
    id: 4,
    title: "CC-Centre",
    description: "Redesigned entire website from scratch for a local community centre. Allows them to showcase their events and facilities also uses SendGrid Email API for a contact form. Got experience using all areas of software development cycle and talking to an actual client.",
    image: "/CC-Logo.JPEG",
    link: "https://cc-centre.org",
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
            imgUrl={project.image} 
            gitUrl={project.link}/>



          </motion.li>
        ))} 
          
      </ul>
    
    </section>
      
  );
};

export default ProjectsSection;
