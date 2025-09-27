"use client";
import React, { useEffect, useState, useRef } from "react";
import { Playfair_Display, Acme } from "next/font/google";
import Image from "next/image";
import { TbExternalLink } from "react-icons/tb";
import { FaArrowUp } from "react-icons/fa6";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { motion, AnimatePresence, Variants } from "framer-motion";
import StatsSection from "./StatsSection";

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

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -120 : 120,
    opacity: 0,
    scale: 0.98,
  }),
} as unknown as Variants;

const Services: React.FC<Props> = ({
  isOpen = false,
  onToggle = () => {},
  label = "Portfolio",
  onOpenPanel,
}) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [page, setPage] = useState(0);

  // each project has an image src, a url to open on click, and tags
  const projects: { src: string; url: string; alt?: string; tags?: string[] }[] = [
    { src: "/project-1.png", url: "https://vinx.ca/", alt: "Vinx", tags: ["SaaS","Next Js", "Supabase", "UI/UX"] },
    { src: "/project-2.png", url: "https://drivexfirm.ca/", alt: "DriveX", tags: ["Saas","Next Js", "Supabase", "UI/UX"] },
    { src: "/project-3.png", url: "https://fb-marketplace-bot.web.app/#hero", alt: "FB Bot", tags: ["Ai Automation", "Firebase", "Saas","Next Js", "Supabase", "UI/UX"] },
    { src: "/project-4.png", url: "https://hvtechnologies.app/", alt: "HV Technologies", tags: ["SaaS", "API", "Node.js", "Next Js", "Supabase"] },
    { src: "/project-5.png", url: "https://www.kaivalyamevents.com/", alt: "Kaivalya Events", tags: ["Events", "CMS", "Responsive", "Next Js"] },
    { src: "/project-6.png", url: "https://www.qgroupmedia.com/", alt: "Q Group Media", tags: ["SaaS","Next Js","Express Js", "Aws", "SEO"] },
    { src: "/project-7.png", url: "https://www.obsvector.com/", alt: "Obsvector", tags: ["Portfolio", "Next Js", "SEO",] },
    { src: "/project-8.png", url: "https://www.kisancircle.com/", alt: "Kisan Circle", tags: ["Portfolio", "Next Js", "SEO",] },
  ];

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
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

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setIndex((prev) => {
      const next = (prev + newDirection + projects.length) % projects.length;
      return next;
    });
  };

  const goPrevProject = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    paginate(-1);
  };
  const goNextProject = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    paginate(1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight") goNextProject();
      if (e.key === "ArrowLeft") goPrevProject();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, index]);

  return (
    <div
      aria-expanded={isOpen}
      className="relative group h-full w-full text-white focus:outline-none"
    >
      <AnimatePresence initial={false} mode="wait">
        {!isOpen ? (
          <motion.div
            key="collapsed-services"
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
                src="/portfolio-icon.webp"
                width={60}
                height={60}
                alt="no icon found"
                className="rotate-180 sm:w-[100px] sm:h-[100px]"
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="expanded-services"
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
              <motion.div
                className="sticky top-0 min-h-screen z-40 bg-gradient-to-t from-[#08aa48] to-[#006400]"
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
                      View my projects showcasing creativity and quality in web
                      solutions.
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
                    Portfolio
                  </motion.div>
                </div>
              </motion.div>

              <motion.section
                ref={nextSectionRef}
                className="relative z-50 bg-white text-start px-6 sm:px-10 py-10 sm:py-20 flex flex-col gap-8 items-center"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
              >
                <div className="w-full max-w-6xl">
                  <div className="text-[#006400] text-4xl sm:text-5xl md:text-[48px] mb-6 sm:mb-10">
                    Some of the greatest work of mine.
                  </div>

                  <div
                    ref={containerRef}
                    className="relative w-full flex items-center justify-center"
                  >
                    <div className="w-full flex justify-center">
                      <div className="relative w-[92%] lg:w-[70%] aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl">
                        <AnimatePresence custom={direction} initial={false}>
                          <motion.div
                            key={projects[index].src}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                              duration: 0.45,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <Image
                              src={projects[index].src}
                              alt={
                                projects[index].alt ?? `Project ${index + 1}`
                              }
                              fill
                              sizes="(max-width: 1024px) 92vw, 70vw"
                              style={{ objectFit: "cover", cursor: "pointer" }}
                              priority={index === 0}
                            />
                            {/* clickable overlay to open project URL in new tab */}
                            <a
                              href={projects[index].url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute inset-0 z-20"
                              aria-label={`Open ${
                                projects[index].alt ?? `Project ${index + 1}`
                              }`}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>

                    <button
                      onClick={goPrevProject}
                      aria-label="Previous project"
                      className="absolute left-3 bottom-6 md:left-6 md:bottom-8 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full border border-gray-300 bg-white/90 flex items-center justify-center shadow backdrop-blur-sm hover:scale-95 transition"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#111827"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>

                    <button
                      onClick={goNextProject}
                      aria-label="Next project"
                      className="absolute right-3 bottom-6 md:right-6 md:bottom-8 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full border border-gray-300 bg-white/90 flex items-center justify-center shadow backdrop-blur-sm hover:scale-95 transition"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#111827"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>

                    <div className="absolute left-6 top-full mt-6 md:left-8 md:mt-8 text-sm md:text-base text-gray-700">
                      <span className="font-semibold">{index + 1}</span>
                      <span className="mx-2">/</span>
                      <span>{projects.length}</span>
                    </div>

                    <div className="absolute right-6 top-12 hidden md:flex flex-col gap-3">
                      {projects[index]?.tags?.map((t, i) => (
                        <span key={i} className="bg-black text-white text-sm px-4 py-2 rounded-full shadow">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>
              <StatsSection />
              <motion.div
                className="flex flex-col sm:flex-row w-full h-[300px] relative z-50"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
              >
                <motion.div
                  onClick={() => onOpenPanel?.(3)}
                  className="bg-gradient-to-r from-[#ff9100] to-[#ff1744] w-full sm:w-1/2 flex flex-col justify-between cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex justify-between p-5">
                    <div />
                    <Image
                      src="/services-icon.webp"
                      width={80}
                      height={80}
                      alt="No Icon Found"
                      className="sm:w-[120px] sm:h-[120px]"
                    />
                  </div>
                  <div className="text-4xl sm:text-6xl md:text-7xl text-white px-4 sm:px-5 pb-2 sm:pb-5">
                    Services
                  </div>
                </motion.div>

                <motion.div
                  onClick={() => onOpenPanel?.(5)}
                  className="bg-gradient-to-r from-[#ff00cc] to-[#ff3300] w-full sm:w-1/2 flex flex-col justify-between cursor-pointer"
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
                    Resume
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

export default Services;