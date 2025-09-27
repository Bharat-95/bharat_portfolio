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

const Services: React.FC<Props> = ({
  isOpen = false,
  onToggle = () => {},
  label = "Services",
  onOpenPanel,
}) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [page, setPage] = useState(0);

  // ref for the white services section
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
                src="/Services-icon.webp"
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
              {/* Hero */}
              <motion.div
                className="sticky top-0 min-h-screen z-40 bg-gradient-to-t from-[#ff9100] to-[#ff1744]"
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
                      4+ years of experience with over 50 projects delivered as a
                      freelancer.
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
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    variants={fadeIn}
                  >
                    Services
                  </motion.div>
                </div>
              </motion.div>

              {/* Services Section */}
              <motion.section
                ref={nextSectionRef}
                className="relative z-50 bg-white text-start px-6 sm:px-10 py-10 sm:py-20 flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-center"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
              >
                <div className="w-full md:w-[50%]">
                  <div className="text-[#ff1744] text-4xl sm:text-5xl md:text-[60px] mb-6 sm:mb-10">
                    My Services
                  </div>
                  <div className="text-black text-sm sm:text-base md:text-[17px] font-light leading-relaxed space-y-4">
                    <p>
                      <strong>Frontend Development:</strong> Building fast,
                      responsive, and user-friendly interfaces using React.js,
                      Next.js, and React Native.
                    </p>
                    <p>
                      <strong>Backend Development:</strong> Developing scalable
                      APIs and real-time systems with Node.js, Express.js,
                      Supabase, and MongoDB.
                    </p>
                    <p>
                      <strong>Cloud & Deployment:</strong> Leveraging AWS and
                      Firebase for hosting, authentication, storage, and
                      serverless architecture.
                    </p>
                    <p>
                      <strong>Full-Stack Solutions:</strong> Delivering complete
                      end-to-end applications — from UI/UX to database and cloud
                      deployment.
                    </p>
                  </div>
                </div>

                <motion.div
                  className="w-[80%] sm:w-[60%] md:w-[40%] h-auto border-[2px] border-[#ff1744] rounded-lg overflow-hidden shadow-md"
                  variants={fadeIn}
                >
                  <Image
                    src="/services.webp"
                    width={500}
                    height={500}
                    alt="Services Illustration"
                    className="w-full h-auto object-cover"
                  />
                </motion.div>
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
                      src="/services-icon.webp"
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

export default Services;
