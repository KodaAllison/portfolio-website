'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import Image from 'next/image'

const EmailSection = () => {
    const [emailSubmitted, setEmailSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            email: e.target.email.value,
            subject: e.target.subject.value,
            message: e.target.message.value,
        };
        const JSONdata = JSON.stringify(data);
        const endpoint = "/api/send";

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSONdata,
        };

        const response = await fetch(endpoint, options);
        const resData = await response.json();

        if (resData.status === 200) {
            console.log("Message sent.");
            setEmailSubmitted(true);
        } else {
            console.log("Message not sent")
        }
    };

    return (
        <section id="contact" className='grid md:grid-cols-2 my-12 py-24 gap-4'>
            <div>
                <h5 className='text-xl font-bold text-white my-2 '>Contact Me</h5>
                <div className='socials flex flex-row gap-2'>
                    <Link href='https://github.com/KodaAllison'>
                        <Image src="/github-icon.svg" alt="github" height={30} width={30} />
                    </Link>
                    <Link href="https://linkedin.com/in/koda-allison/">
                        <Image src="/linkedin-icon.svg" alt="linkedin" height={30} width={30} />
                    </Link>
                </div>
            </div>
            {/* <div>
                <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                    <label htmlFor='email' className='text-white block text-sm font-medium '>
                        Your Email
                    </label>
                    <input
                        name='email'
                        type='email'
                        id='email'
                        required
                        className='bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5'
                        placeholder='your@email.com' />
                    <label htmlFor='subject' className='text-white block text-sm font-medium '>
                        Subject
                    </label>
                    <input
                        name='subject'
                        type='text'
                        id='subject'
                        required
                        className='bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5'
                        placeholder='Subject' />

                    <label className='text-white block text-sm font-medium mb-1'
                        htmlFor='message'>
                        Message
                    </label>
                    <textarea
                        name='message'
                        id='message'
                        className='bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5'
                        placeholder='Type your message here...'
                    />
                    <button
                        type='submit'
                        className='mt-4 py-2.5 px-5 rounded-lg bg-gradient-to-br from-[#DA291C] to-[#FBE122] hover:bg-slate-300 text-white w-full '>
                        Submit
                    </button>
                </form>
            </div> */}
        </section>
    )
}

export default EmailSection
