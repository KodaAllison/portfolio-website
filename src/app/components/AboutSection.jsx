'use client';

import React, {useTransition, useState} from 'react';
import TimerComponent from './TimerComponent';
import TabButton from './TabButton';

const TAB_DATA = [
    {
        title: "Skills",
        id: "skills",
        content: (
            <ul className='list-disc pl-2'>
                <li>Software Development Cycle - Mainly Agile</li>
                <li>Python</li>
                <li>Java</li>
                <li>HTML</li>
                <li>CSS & TailwindCSS</li>
                <li>Git & GitHub</li>
                <li>React & NextJS</li>
                <li>MongoDB</li>
                <li>SQL</li>
            </ul>
        ),

    },
    {
        title: "Education",
        id: "education",
        content: (
            <ul className='list-disc pl-2'>
                <li>Newcastle University - BSc Computer Science (Software Engineering) - On Track for First Class Honours</li>
            </ul>
        ),

    },
    {
        title: "Other",
        id: "other",
        content: (
            <ul className='list-disc pl-2'>
                <li>Forage - J.P Morgan Job Simulation</li>
                <li>Co-founded IT & Coding Club in Sixth Form</li>
                <li>Started for University American Football team</li>
            </ul>
        ),

    }

]

const AboutSection = () => {
    const [tab, setTab] = useState("skills");
    const [isPending, startTransistion] = useTransition();

    const handleTabChange = (id) => {
        startTransistion(() => {setTab(id)})
    }

  return (
    <section className='text-white'>
    <div className='md:flex md:justify-between gap-8 items-start py-8 px-4 xl:gap-16 sm:py-16 xl:px-16'>
        <div className='md:w-1/3'>
            <div className='py-4 sticky top-0'>
                <h2 className='text-center font-bold'>Countdown To My First Marathon - Barcelona 2025</h2>
                <TimerComponent />
            </div>
        </div>
        <div className='md:w-2/3'>
            <div className='flex flex-col h-full text-left'>
                <h2 className='text-4xl font-bold mt-2 md:mt-0 mb-4'>About me</h2>
                <p className='text-base lg:text-lg'>
                    I am currently in my final year studying Computer Science at Newcastle University, specializing in Software Engineering. Growing up with my dad, a software engineer with over 15 years of experience, I inherited his passion for tech.
                    During my academic journey, I have primarily used Python and Java. Recently, I had the opportunity to work on a group project where we built an app aligned with one of the United Nations climate change goals. This experience allowed me to familiarize myself with all stages of the software development cycle.
                    Outside of academics, I have delved deeper into technologies such as React and NextJS. These technologies have expanded my understanding and passion for creating intuitive user interfaces.
                    Beyond coding, I prioritize my fitness and health, I enjoy being consistent in the gym, with my nutrition, and currently training for a marathon. I take pleasure in setting ambitious goals and tracking my progress, whether in software development or personal endeavors.
                </p>
                <div className='flex flex-row mt-8'>
                    <TabButton 
                        selectTab={() => handleTabChange("skills")}
                        active={tab === "skills"} > 
                        {" "} Skills {" "}
                    </TabButton>
                    <TabButton 
                        selectTab={() => handleTabChange("education")}
                        active={tab === "education"} > 
                        {" "} Education {" "}
                    </TabButton>
                    <TabButton 
                        selectTab={() => handleTabChange("other")}
                        active={tab === "other"} > 
                        {" "} Other {" "}
                    </TabButton>
                </div>
                <div className='mt-6'>
                    {TAB_DATA.find((t) => t.id === tab).content}
                </div>
            </div>
        </div>
    </div>
</section>



  )
}

export default AboutSection