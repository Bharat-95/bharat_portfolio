"use client";
import React, { useEffect, useState, useRef } from "react";
import { Playfair_Display, Acme } from "next/font/google";
import Image from "next/image";
import { TbExternalLink } from "react-icons/tb";
import { FaArrowUp } from "react-icons/fa6";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { motion, AnimatePresence, Variants } from "framer-motion";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
const acme = Acme({
  subsets: ["latin"],
  weight: ["400"],
});

interface Feedback {
  id: string;
  client_name: string | null;
  rating: string | null;
  comments: string | null;
  website_url: string;
}

interface Props {
  isOpen?: boolean;
  onToggle?: () => void;
  label?: string;
  onOpenPanel?: (idx: number) => void;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

/* Simple CountUp for skills %
   Local to this file to keep changes minimal */
const CountUp: React.FC<{ end: number; duration?: number; suffix?: string; className?: string }> = ({
  end,
  duration = 900,
  suffix = "%",
  className = "",
}) => {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let start: number | null = null;
    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(1, elapsed / duration);
      const current = Math.floor(progress * end);
      setValue(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
        setValue(end);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration]);

  return (
    <span className={className}>
      {value}
      {value >= end ? suffix : ""}
    </span>
  );
};

const Resume: React.FC<Props> = ({
  isOpen = false,
  onToggle = () => {},
  label = "Resume",
  onOpenPanel,
}) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [page, setPage] = useState(0);

  // ref for the white resume section
  const nextSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      const { data, error } = await supabaseBrowser
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) {
        setFeedbacks((data as Feedback[]) || []);
        setPage(0);
      }
    };

    if (isOpen) fetchFeedback();
  }, [isOpen]);

  const handleScrollDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    nextSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* Skills data - each entry has icon (replace with your asset paths), label and percent */
  const skills: { icon: string; name: string; percent: number }[] = [
    { icon: "/html5-logo.svg", name: "HTML", percent: 99 },
    { icon: "/css3-logo.svg", name: "CSS", percent: 80 },
      { icon: "/tailwindcss.svg", name: "tailwindCSS", percent: 95 },
    { icon: "/javascript-logo.svg", name: "JavaScript", percent: 80 },
     { icon: "/typescript-logo.svg", name: "TypeScript", percent: 70 },
    { icon: "react-logo.svg", name: "React", percent: 90 },
    { icon: "/next-js-logo.svg", name: "Next.js", percent: 85 },
    { icon: "/jsiconWhite.svg", name: "Node.js", percent: 80 },
    { icon: "/express-js.png", name: "Express.js", percent: 80 },
  ];

  return (
    <div
      aria-expanded={isOpen}
      className="relative group h-full w-full text-white focus:outline-none"
    >
      <AnimatePresence initial={false} mode="wait">
        {!isOpen ? (
          <motion.div
            key="collapsed-resume"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeInUp}
            onClick={onToggle}
            className={`${playfair.className} select-none text-white text-6xl sm:text-7xl md:text-9xl font-extrabold
              [writing-mode:vertical-rl] rotate-180 flex items-end justify-start
              h-full w-full px-4 sm:px-6 gap-6 sm:gap-10 cursor-pointer`}
          >
            {label}
            <TbExternalLink
              size={40}
              className="opacity-0 group-hover:opacity-100 rotate-90 md:size-20"
            />
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto">
              <Image
                src="/resume-icon.webp"
                width={60}
                height={60}
                alt="no icon found"
                className="rotate-180 sm:w-[100px] sm:h-[100px]"
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="expanded-resume"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeIn}
            className="relative h-screen w-inherit z-40"
          >
            <motion.div
              className="overflow-y-auto h-screen no-scrollbar"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {/* Hero */}
              <motion.div
                className="sticky top-0 min-h-screen z-40 bg-gradient-to-t from-[#ff00cc] to-[#ff3300]"
                variants={fadeInUp}
              >
                <div className="flex flex-col min-h-screen relative">
                  <div className="flex items-start justify-end gap-2 sm:gap-4 px-4 sm:px-6 pt-4 sm:pt-6">
                    <motion.button
                      onClick={onToggle}
                      whileTap={{ scale: 0.98 }}
                      className="p-2 rounded-md text-base cursor-pointer sm:text-lg md:text-[20px] flex items-center gap-2 underline underline-offset-8"
                    >
                      Back to Menu <FaArrowUp size={20} />
                    </motion.button>
                  </div>

                  <motion.div
                    className="flex-1 flex flex-col p-6 sm:p-10"
                    variants={fadeInUp}
                  >
                    <motion.h2
                      className={`opacity-95 ${acme.className} text-3xl sm:text-5xl md:text-[60px] text-left  md:max-w-2xl lg:max-w-2xl`}
                    >
                      Explore my experience, education, and achievements in web
                      development.
                    </motion.h2>
                  </motion.div>

                  <motion.button
                    onClick={handleScrollDown}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="absolute bottom-6 left-6 flex items-center gap-2 cursor-pointer"
                  >
                    <span
                      className={`${acme.className} text-sm sm:text-lg underline underline-offset-4`}
                    >
                      Scroll
                    </span>
                    <span className="text-lg sm:text-xl">↓</span>
                  </motion.button>

                  <motion.div
                    className={`${playfair.className} text-white font-extrabold text-5xl sm:text-7xl md:text-[7rem] leading-none absolute right-0 -top-4 h-full flex items-end`}
                    style={{
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                    }}
                    variants={fadeIn}
                  >
                    Resume
                  </motion.div>
                </div>
              </motion.div>

              {/* resume Section */}
              <motion.section
                ref={nextSectionRef}
                className="relative z-50 bg-white text-start px-6 sm:px-10 py-10 sm:py-20 flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-center"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
              >
                <div className="w-full ">
                  <div className="text-[#ff1744] text-4xl sm:text-5xl md:text-[60px] mb-6 sm:mb-10 max-w-2xl">
                    Building quality web solutions with proven expertise.
                  </div>
                  <div className="text-black text-2xl leading-relaxed space-y-4 max-w-2xl">
                    <p className="text-gray-600 mb-6">
                      I design and build web products people enjoy using —
                      combining thoughtful UX, clean engineering, and scalable
                      infrastructure so ideas become reliable, long-lived
                      software.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Experiences section (updated to match image) */}
              <motion.section
                className="relative z-50 bg-white text-start px-6 sm:px-10 py-10 sm:py-20"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
              >
                <div className="max-w-6xl mx-auto">
                  <h3 className="text-[#ff1744] text-4xl sm:text-5xl md:text-[60px] mb-8">
                    Experiences
                  </h3>

                  <div className="divide-y divide-gray-200">
                    {/* Item 1 */}
                    <div className="py-10 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      <div className="md:col-span-2">
                        <div className="text-2xl md:text-xl font-extrabold text-gray-800">
                          2023 - Today
                        </div>
                      </div>

                      <div className="md:col-span-6">
                        <div className="text-2xl md:text-3xl font-semibold text-gray-900">
                          Full Stack Developer
                        </div>
                        <div className="text-sm md:text-base text-gray-500 mt-2">
                          in <span className="text-[#ff1744] font-medium">Upwork</span>
                        </div>
                      </div>

                      <div className="md:col-span-4">
                        <p className="text-gray-600 text-lg font-light">
                          Led end-to-end web projects using React, Next.js and Node — improved load performance and implemented scalable APIs, CI/CD and monitoring for production-grade apps.
                        </p>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="py-10 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      <div className="md:col-span-2">
                        <div className="text-2xl md:text-xl font-extrabold text-gray-800">
                          2021 - 2023
                        </div>
                      </div>

                      <div className="md:col-span-6">
                        <div className="text-2xl md:text-3xl font-semibold text-gray-900">
                          Senior Full Stack Developer
                        </div>
                        <div className="text-sm md:text-base text-gray-500 mt-2">
                          at <span className="text-[#ff1744] font-medium">Introvex LLC</span>, India
                        </div>
                      </div>

                      <div className="md:col-span-4">
                        <p className="text-gray-600 text-lg font-light">
                          Built polished, accessible frontends and component libraries; collaborated with designers to deliver responsive and animation-rich user interfaces.
                        </p>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="py-10 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      <div className="md:col-span-2">
                        <div className="text-2xl md:text-xl font-extrabold text-gray-800">
                          2019 - 2021
                        </div>
                      </div>

                      <div className="md:col-span-6">
                        <div className="text-2xl md:text-3xl font-semibold text-gray-900">
                          Frontend Developer
                        </div>
                        <div className="text-sm md:text-base text-gray-500 mt-2">
                          at <span className="text-[#ff1744] font-medium">Adidev Technologies</span>, USA
                        </div>
                      </div>

                      <div className="md:col-span-4">
                        <p className="text-gray-600 text-lg font-light">
                          Implemented UI features, optimized performance, and maintained legacy code while introducing modern tooling and testing practices.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Skills section - styled like the screenshot but using red accent */}
              <motion.section
                className="relative z-50 bg-white text-start px-6 sm:px-10 py-10 sm:py-20"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
              >
                <div className="max-w-6xl mx-auto">
                  <h3 className="text-[#ff1744] text-4xl sm:text-5xl md:text-[60px] mb-8">
                    Skills
                  </h3>

                  <div className="space-y-8 divide-y divide-gray-200">
                    {skills.map((s, idx) => (
                      <div key={s.name} className="flex items-center justify-between py-10 ">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-xl bg-[#ff1744] flex items-center justify-center shadow-lg">
                            <Image src={s.icon} alt={s.name} width={56} height={56} className="object-contain" />
                          </div>
                          <div className="text-2xl md:text-3xl font-semibold" style={{ backgroundImage: "linear-gradient(90deg,#ff1744,#ff6a4d)", WebkitBackgroundClip: "text", color: "transparent" }}>
                            {s.name}
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          {/* big percentage on right */}
                          <div className="text-4xl md:text-5xl font-extrabold text-gray-900">
                            <CountUp end={s.percent} duration={900} className="inline-block" />
                            <span className="text-2xl">%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                  </div>
                </div>
              </motion.section>

              {/* Bottom tiles */}
              <motion.div
                className="flex flex-col sm:flex-row w-full h-[300px] relative z-50"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
              >
                <motion.div
                  onClick={() => onOpenPanel?.(2)}
                  className="bg-gradient-to-r from-[#ff00ff] to-[#601a89] w-full sm:w-1/2 flex flex-col justify-between cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex justify-between p-5">
                    <div />
                    <Image
                      src="/about-icon.webp"
                      width={80}
                      height={80}
                      alt="No Icon Found"
                      className="sm:w-[120px] sm:h-[120px]"
                    />
                  </div>
                  <div className="text-4xl sm:text-6xl md:text-7xl text-white px-4 sm:px-5 pb-2 sm:pb-5">
                    About
                  </div>
                </motion.div>

                <motion.div
                  onClick={() => onOpenPanel?.(4)}
                  className="bg-gradient-to-r from-[#08aa48] to-[#006400] w-full sm:w-1/2 flex flex-col justify-between cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex p-5">
                    <Image
                      src="/resume-icon.webp"
                      width={80}
                      height={80}
                      alt="No Icon Found"
                      className="sm:w-[120px] sm:h-[120px]"
                    />
                  </div>
                  <div className="text-4xl sm:text-6xl md:text-7xl text-white flex justify-end px-4 sm:px-5 pb-2 sm:pb-5">
                    Portfolio
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Resume;
