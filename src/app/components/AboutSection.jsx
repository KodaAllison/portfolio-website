'use client'
import React, {useTransition, useState} from 'react';
import TimerComponent from './TimerComponent';
import TabButton from './TabButton';

const TAB_DATA = [
    {
        title: "Skills",
        id: "skills",
        content: (
            <ul className='list-disc pl-2'>
                <li>Python</li>
                <li>Java</li>
                <li>NextJS</li>
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
                <li>Newcastle University - BSc Computer Science (Software Engineering) - First Class Honours</li>
            </ul>
        ),

    },
    {
        title: "Other",
        id: "other",
        content: (
            <ul className='list-disc pl-2'>
                
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
        <div id='column-1' className='md:grid md:grid-cols-2 gap-8 items-center py-8 px-4 xl:gap16 sm:py-16 xl:px-16'>
            <div>
                <h2 className='text-center font-bold'>Countdown To My First Marathon - Barcelona 2025</h2>
            <TimerComponent />
            </div>
            <div id='column-2' className=' mt-4 md:mt-0 flex flex-col h-full text-left'>
                <h2 className='text-4xl font-bold mt-2 md:mt-0 mb-4'>About me</h2>
                <p className='text-base lg:text-lg'>
                    I am currently in my final year of studying Computer Science at Newcastle University, specialising in Software Engineering. My dad has 15 years plus experience as a software engineer and this played a role in starting my passion for learning technology. Outside of tech I enjoy dedicating time to the gym, nutrition and running. I take pride and gain satisfaction in closely tracking my progress in these areas in great detail.  
                </p>
                <div className='flex flex-row mt-8'>
                    <TabButton 
                    selectTab={() => handleTabChange("skills")}
                    active={tab=== "skills"} > 
                    {" "} Skills {" "}
                    </TabButton>
                    <TabButton 
                    selectTab={() => handleTabChange("education")}
                    active={tab=== "education"} > 
                    {" "} Education {" "}
                    </TabButton>
                    <TabButton 
                    selectTab={() => handleTabChange("other")}
                    active={tab=== "other"} > 
                    {" "} Other {" "}
                    </TabButton>
                 
                    
                </div>
                <div className='mt-6'>
                    {TAB_DATA.find((t) => t.id === tab).content}
                </div>
            </div>
        </div>
    </section>
  )
}

export default AboutSection