import React from 'react';
import { LinkIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

const ProjectCard = ({ title, description, gitUrl }) => {
  return (
    <div className="h-auto rounded-xl shadow-md shadow-slate-200/60 dark:shadow-slate-900/40 bg-white dark:bg-[#181818] py-6 px-4 text-slate-900 dark:text-white transition-colors duration-300 hover:shadow-lg hover:shadow-slate-300/60 dark:hover:shadow-slate-900/60 flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <h2 className="font-semibold text-xl">{title}</h2>
        <Link
          className="h-8 w-8 flex items-center justify-center rounded-full border-2 border-slate-300 dark:border-[#ADB7BE] hover:border-slate-500 dark:hover:border-white transition-colors flex-shrink-0"
          href={gitUrl}
        >
          <LinkIcon className="h-5 w-5 text-slate-600 dark:text-[#ADB7BE] hover:text-slate-900 dark:hover:text-white" />
        </Link>
      </div>
      <p className="text-slate-600 dark:text-[#ADB7BE] flex-grow line-clamp-5">{description}</p>
    </div>
  );
};

export default ProjectCard;
