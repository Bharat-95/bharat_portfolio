// app/page.tsx
"use client";
import React, { useState } from "react";
import About from "@/components/About";
import Hero from "@/components/Hero";
import { BiMenuAltRight } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio"
import Resume from '@/components/Resume'
import Contact from '@/components/Contact'

const Page: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsing, setCollapsing] = useState(false);

  const toggle = (idx: number) => {
    if (openIndex === idx) {
      setCollapsing(true);
      setTimeout(() => {
        setOpenIndex(null);
        setCollapsing(false);
      }, 500);
    } else {
      setOpenIndex(idx);
    }
  };

  const panelClass = (idx: number): string => {
    if (idx === 1) return "w-96";
    if (openIndex !== null) {
      if (idx === openIndex) {
        return collapsing
          ? "flex-[1] opacity-0 transition-all duration-500 ease-in-out"
          : "flex-[999] opacity-100 transition-all duration-500 ease-in-out";
      }
      return "hidden";
    }
    return "flex-[1] hover:flex-[1.5] transition-all duration-500 ease-in-out";
  };

  const openMobileMenu = () => setMobileOpen(true);
  const closeMobileMenu = () => setMobileOpen(false);

  const onMobileTileClick = (idx: number) => {
    setOpenIndex(idx);
    setMobileOpen(false);
  };

  return (
    <div className="flex h-full w-full text-white font-extrabold text-3xl">
      <div className="fixed lg:w-96 md:w-96 h-full w-full bg-gradient-to-t from-[#ffea00] to-[#ff7e00]">
        <Hero />
      </div>

      {openIndex === null && !mobileOpen && (
        <button
          aria-label="Open menu"
          onClick={openMobileMenu}
          className="md:hidden fixed top-4 right-5 z-50 bg-white text-black rounded-lg shadow-lg p-2"
        >
          <BiMenuAltRight size={40} />
        </button>
      )}

      <div className="md:flex lg:flex flex-1 hidden ml-96">
        <div
          className={`${panelClass(2)} bg-gradient-to-t from-[#ff00ff] to-[#601a89]`}
        >
          <About
            isOpen={openIndex === 2}
            onToggle={() => toggle(2)}
            onOpenPanel={(idx) => setOpenIndex(idx)}
            label="About"
          />
        </div>

        <div
          className={`${panelClass(
            3
          )} bg-gradient-to-t from-[#ff9100] to-[#ff1744] flex items-center justify-center`}
         
        >
         <Services
            isOpen={openIndex === 3}
            onToggle={() => toggle(3)}
            onOpenPanel={(idx) => setOpenIndex(idx)}
            label="Services"
          />
        </div>

        <div
          className={`${panelClass(
            4
          )} bg-gradient-to-t from-[#08aa48] to-[#006400] flex items-center justify-center`}
         
        >
         <Portfolio
            isOpen={openIndex === 4}
            onToggle={() => toggle(4)}
            onOpenPanel={(idx) => setOpenIndex(idx)}
            label="Portfolio"
          />
        </div>

        <div
          className={`${panelClass(
            5
          )} bg-gradient-to-t from-[#ff00cc] to-[#ff3300] flex items-center justify-center`}
         
        >
         <Resume
            isOpen={openIndex === 5}
            onToggle={() => toggle(5)}
            onOpenPanel={(idx) => setOpenIndex(idx)}
            label="Resume"
          />
        </div>

        <div
          className={`${panelClass(
            6
          )} bg-gradient-to-t from-[#313fd9] to-[#032e70] flex items-center justify-center`}
         
        >
         <Contact
            isOpen={openIndex === 6}
            onToggle={() => toggle(6)}
            onOpenPanel={(idx) => setOpenIndex(idx)}
            label="Contact"
          />
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 overflow-y-auto">
          <button
            aria-label="Close menu"
            onClick={closeMobileMenu}
            className="fixed top-4 right-5 z-60 bg-white text-black rounded-lg shadow-lg p-2"
          >
            <IoMdClose size={36} />
          </button>

          <div className="flex flex-col w-full">
            <button
              onClick={() => onMobileTileClick(2)}
              style={{
                height: "calc(100vh / 5)",
                background: "linear-gradient(90deg,#ff00ff,#601a89)",
              }}
              className="w-full flex items-end justify-between p-6 cursor-pointer"
            >
              <div className="text-white text-4xl font-extrabold leading-none">
                About
              </div>
            </button>

            <button
              onClick={() => onMobileTileClick(3)}
              style={{
                height: "calc(100vh / 5)",
                background: "linear-gradient(90deg,#ff9100,#ff1744)",
              }}
              className="w-full flex items-end justify-between p-6 cursor-pointer"
            >
              <div className="text-white text-4xl font-extrabold leading-none">
                Services
              </div>
            </button>

            <button
              onClick={() => onMobileTileClick(4)}
              style={{
                height: "calc(100vh / 5)",
                background: "linear-gradient(90deg,#08aa48,#006400)",
              }}
              className="w-full flex items-end justify-between p-6 cursor-pointer"
            >
              <div className="text-white text-4xl font-extrabold leading-none">
                Portfolio
              </div>
            </button>

            <button
              onClick={() => onMobileTileClick(5)}
              style={{
                height: "calc(100vh / 5)",
                background: "linear-gradient(90deg,#ff00cc,#ff3300)",
              }}
              className="w-full flex items-end justify-between p-6 cursor-pointer"
            >
              <div className="text-white text-4xl font-extrabold leading-none">
                Resume
              </div>
            </button>

            <button
              onClick={() => onMobileTileClick(6)}
              style={{
                height: "calc(100vh / 5)",
                background: "linear-gradient(90deg,#313fd9,#032e70)",
              }}
              className="w-full flex items-end justify-between p-6 cursor-pointer"
            >
              <div className="text-white text-4xl font-extrabold leading-none">
                Contact
              </div>
            </button>
          </div>
        </div>
      )}

      {openIndex === 2 && (
        <div className="md:hidden fixed inset-0 z-40 bg-white">
          <About
            isOpen={true}
            onToggle={() => toggle(2)}
            onOpenPanel={(idx) => setOpenIndex(idx)}
            label="About"
          />
        </div>
      )}
        {openIndex === 3 && (
        <div className="md:hidden fixed inset-0 z-40 bg-white">
          <Services
            isOpen={true}
            onToggle={() => toggle(3)}
            onOpenPanel={(idx) => setOpenIndex(idx)}
            label="About"
          />
        </div>
      )}
       {openIndex === 4 && (
        <div className="md:hidden fixed inset-0 z-40 bg-white">
          <Portfolio
            isOpen={true}
            onToggle={() => toggle(4)}
            onOpenPanel={(idx) => setOpenIndex(idx)}
            label="Portfolio"
          />
        </div>
      )}
       {openIndex === 5 && (
        <div className="md:hidden fixed inset-0 z-40 bg-white">
          <Resume
            isOpen={true}
            onToggle={() => toggle(5)}
            onOpenPanel={(idx) => setOpenIndex(idx)}
            label="Resume"
          />
        </div>
      )}
       {openIndex === 6 && (
        <div className="md:hidden fixed inset-0 z-40 bg-white">
          <Contact
            isOpen={true}
            onToggle={() => toggle(6)}
            onOpenPanel={(idx) => setOpenIndex(idx)}
            label="Resume"
          />
        </div>
      )}
    </div>
  );
};

export default Page;
