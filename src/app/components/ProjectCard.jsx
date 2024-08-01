import React from 'react';
import { CodeBracketIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

const ProjectCard = ({ imgUrl, title, description, gitUrl }) => {
  return (
    <div>
      <div 
        className="h-52 md:h-72 rounded-t-xl relative group" 
        style={{ background: `url(${imgUrl})`, backgroundSize: "cover", backgroundPosition: "center", backgroundPositionY:"Top" }}
      >
        <div className='overlay  items-center justify-center absolute top-0 left-0 w-full h-full bg-[#181818] bg-opacity-0 hidden group-hover:flex group-hover:bg-opacity-80 transition-all duration-500' >
          <Link className='h-14 w-14 relative rounded-full border-2 border-[#ADB7BE] group/link' href={gitUrl}>
            <CodeBracketIcon className='h-10 w-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer text-[#ADB7BE] group-hover/link:text-white' />
          </Link>
        </div>
      </div>
      <div className='text-white rounded-b-xl bg-[#181818] py-6 px-4'>
        <h2 className='font-semibold text-xl mb-2'>{title}</h2>
        <p className='text-[#ADB7BE]'>{description}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
