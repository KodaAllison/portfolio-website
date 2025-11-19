'use client';

import React, {useTransition, useState} from 'react';
import TimerComponent from './TimerComponent';
import TabButton from './TabButton';

const TAB_DATA = [
    {
        title: "Technical Skills",
        id: "skills",
        content: (
            <ul className='list-disc pl-2'>
                
                <li>TypeScript / JavaScript</li>
                <li>React / NextJS</li>
                <li>Deno / Fresh</li>
                <li>Tailwind CSS</li>
                <li>Git & GitHub</li>
                
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
        title: "Human Skills",
        id: "human-skills",
        content: (
            <ul className='list-disc pl-2'>
                <li>Collaborative, Team Player</li>
                <li>Curious, Quick Learner</li>
                <li>Problem Solver</li>
                <li>Growth Mindset</li>
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
       
        <div className='md:w-2/3'>
            <div className='flex flex-col h-full text-left'>
                <h2 className='text-4xl font-bold mt-2 md:mt-0 mb-4'>About me</h2>
                <p className='text-base lg:text-lg'>
                    I studied Computer Science at Newcastle University and currently work as a Technical Graduate with Virgin Money. Within this role I will rotate through different placements to gain valuable experience from a range of people.  I have always been curious about the way things work - ‘Why?’ was my favourite word growing up, and it continues to inspire me to explore new technologies and solve complex problems. I take pride in my attention to detail, this has been key in both my academic achievements and personal pursuits, such as tracking my training and nutrition while preparing for marathons and other fitness challenges.</p>
                
            </div>
        </div>
        <div className='md:w-1/3'>
        <div className='flex flex-row mt-8'>
                    <TabButton 
                        selectTab={() => handleTabChange("skills")}
                        active={tab === "skills"} > 
                        {" "} Technical Skills {" "}
                    </TabButton>
                    <TabButton 
                        selectTab={() => handleTabChange("human-skills")}
                        active={tab === "human-skills"} > 
                        {" "} Human Skills {" "}
                    </TabButton>
                    <TabButton 
                        selectTab={() => handleTabChange("education")}
                        active={tab === "education"} > 
                        {" "} Education {" "}
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