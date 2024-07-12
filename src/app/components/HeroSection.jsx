"use client"
import React from 'react'
import Image from 'next/image'
import { TypeAnimation } from 'react-type-animation';

const HeroSection = () => {
  return (
    <section>
        <div className='grid grid-cols-1 sm:grid-cols-12'>
            <div className='col-span-7 place-self-center text-center sm:text-left '>
                <h1 className='text-white mb-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold'>
                    <span className='text-transparent bg-clip-text bg-gradient-to-br from-[#DA291C] to-[#FBE122]'>
                        Hey, I am {" "}</span>
                        <br />
                    <TypeAnimation
                        sequence={[
                            'Koda',
                            1000, 
                            'A Computer Science Student',
                            1000,
                            'A Software Developer',
                            1000,
                            'A Fitness Enthusiast',
                            1000
                        ]}
                        wrapper="span"
                        speed={150}
                        repeat={Infinity}
                        />
                </h1>
                <p className='text-[#ADb7BE] text-base sm:text-lg lg:text-xl pb-4'>
                    Computer Science Student, Software Developer, Fitness fanatic
                </p>
                <div>
                    <button className=' px-6 py-3 rounded-full w-full sm:w-fit mr-4 bg-gradient-to-br from-[#DA291C] to-[#FBE122] hover:bg-slate-300 text-white'>Contact Me</button>
                    <button className=' px-1 py-1 rounded-full w-full sm:w-fit mr-4 bg-gradient-to-br from-[#DA291C] to-[#FBE122] hover:bg-white text-white  mt-3'>
                        <span className='block bg-[#121212] hover:bg-slate-800 rounded-full px-5 py-2'>Download CV{" "}</span>
                    </button>
                </div>
            </div>
            <div className='col-span-5 place-self-center mt-4 lg:mt-0'>
                <div className=' relative w-[250px] h-[250px] lg:w-[400px] lg:h-[400px]'>
                    <Image
                        src = "/profilePhoto.jpg"
                        alt = "HeadShot"
                        className='rounded-full absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'
                        width = {300}
                        height = {300}
                    />
                </div>
            </div>
        </div>
    </section>
  )
}

export default HeroSection