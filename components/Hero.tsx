"use client";
import React from "react";
import { Playfair_Display, Exo_2 } from "next/font/google";
import Image from "next/image";
import { Typewriter } from "react-simple-typewriter";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import Link from "next/link";



const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const exo = Exo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});


const Hero = () => {
  return (
    <section className="relative h-full w-full flex flex-col justify-between">
      <div className={`text-5xl ${playfair.className} p-[7%]`}>Bharat</div>
      <div className="relative w-full h-[70%]">
        <Image
          src="/Hero.png"
          alt="Portrait"
          fill
          className="object-cover object-bottom"
          priority
        />
        <div className="absolute bottom-4 left-0 right-0 px-6 text-center text-white">
          <div className={`${playfair.className} text-4xl font-extrabold w-full`}>
            Bharat Nanavattula
          </div>

          <h2 className={`mt-2 text-xl font-semibold w-full ${exo.className}`}>
            <Typewriter
              words={[
                "Full Stack Developer",
                "CSS Expert",
                "Frontend Engineer",
                "Backend Developer",
                "UI/UX Enthusiast",
              ]}
              loop={true}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1500}
            />
          </h2>
           <div className="flex justify-center mt-3 gap-4">
            <Link href="https://github.com/Bharat-95/" target="_blank"><FaGithub size={30} className="hover:text-blue-200" /></Link>
            <Link href="https://www.linkedin.com/in/bharat-kumar-8a87b4169/" target="_blank"><FaLinkedin size={30} className="hover:text-blue-200" /></Link>
           </div>
        </div>
       
      </div>
    </section>
  );
};

export default Hero;
