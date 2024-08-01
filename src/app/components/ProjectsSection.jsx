"use client";
import React, {useRef} from 'react';
import ProjectCard from './ProjectCard';
import {animate, motion, useInView} from "framer-motion";

const PROJECTS_DATA = [
  {
    id: 1,
    title: "WeatherApp",
    description: "Description",
    image: "/weather.png",
    link: "https://github.com/KodaAllison/weatherapp",
  },
  {
    id: 2,
    title: "FiveSomewhere",
    description: "Description",
    image: "/five.png",
    link: "https://github.com/KodaAllison/five-somewhere",
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
      <h2 className='text-center text-3xl text-white font-bold m-4 '>My Projects</h2>
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
