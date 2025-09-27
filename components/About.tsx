"use client";
import React, { useEffect, useState } from "react";
import { Playfair_Display, Acme } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
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

const normalizeUrl = (maybeUrl: string | null | undefined): string | null => {
  if (!maybeUrl) return null;
  const trimmed = maybeUrl.trim();
  if (trimmed === "") return null;
  return trimmed.startsWith("http://") || trimmed.startsWith("https://")
    ? trimmed
    : `https://${trimmed}`;
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const cardMotion: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  hover: { scale: 1.02, y: -4, transition: { duration: 0.18 } },
};

const About: React.FC<Props> = ({
  isOpen = false,
  onToggle = () => {},
  label = "About",
  onOpenPanel,
}) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabaseBrowser
          .from("feedback")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error) {
          setFeedbacks((data as Feedback[]) || []);
          setPage(0);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) fetchFeedback();
  }, [isOpen]);

  const stop = (e: React.MouseEvent) => e.stopPropagation();
  const handleScrollDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  const itemsPerPage = 2;
  const pageCount = Math.ceil(feedbacks.length / itemsPerPage);
  const startIndex = page * itemsPerPage;
  const visibleFeedbacks = feedbacks.slice(startIndex, startIndex + itemsPerPage);

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(pageCount - 1, p + 1));

  return (
    <div aria-expanded={isOpen} className="relative group h-full w-full text-white focus:outline-none">
      <AnimatePresence initial={false} mode="wait">
        {!isOpen ? (
          <motion.div
            key="collapsed"
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
            <TbExternalLink size={40} className="opacity-0 group-hover:opacity-100 rotate-90 md:size-20" />
            <div
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto"
              onClick={stop}
            >
              <Image src="/about-icon.webp" width={60} height={60} alt="no icon found" className="rotate-180 sm:w-[100px] sm:h-[100px]" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeIn}
            className="relative h-screen w-inherit z-40"
          >
            <div className="overflow-y-auto h-screen no-scrollbar">
              {/* Purple section (sticky) */}
              <motion.div
                className="sticky top-0 min-h-screen z-40 bg-gradient-to-t from-[#ff00ff] to-[#601a89]"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
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
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.25 }}
                  >
                    <motion.h2
                      className={`opacity-95 ${acme.className} text-3xl sm:text-5xl md:text-[60px] text-left  md:max-w-2xl lg:max-w-2xl`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
                    >
                      I am Bharat, full-stack developer from Hyderabad, India.
                    </motion.h2>
                  </motion.div>

                  <motion.button
                    onClick={handleScrollDown}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="absolute bottom-6 left-6 flex items-center gap-2 cursor-pointer"
                  >
                    <span className={`${acme.className} text-sm sm:text-lg underline underline-offset-4`}>Scroll</span>
                    <span className="text-lg sm:text-xl">↓</span>
                  </motion.button>

                  <motion.div
                    className={`${playfair.className} text-white font-extrabold text-5xl sm:text-7xl md:text-[7rem] leading-none absolute right-0 -top-4 h-full flex items-end`}
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    About
                  </motion.div>
                </div>
              </motion.div>

              {/* White intro section */}
              <motion.section
                className="relative z-50 bg-white text-start px-6 sm:px-10 py-10 sm:py-20 flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-center"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
              >
                <div className="w-full md:w-[50%]">
                  <motion.div initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true, amount: 0.25 }}>
                    <div className="text-[#601a89] text-4xl sm:text-5xl md:text-[60px] mb-6 sm:mb-10">Hi, I am Bharat</div>
                    <div className="text-black text-sm sm:text-base md:text-[17px] font-light leading-relaxed space-y-4">
                      <p>I am a passionate Full-Stack Developer from Hyderabad, India...</p>
                      <p>I also leverage AWS and Firebase to deploy, scale, and manage cloud-native applications...</p>
                      <p>I enjoy solving complex problems and creating delightful applications.</p>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  className="w-[80%] sm:w-[60%] md:w-[40%] h-auto border-[2px] border-[#601a89] rounded-lg overflow-hidden shadow-md"
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.25 }}
                >
                  <Image src="/Photo.jpeg" width={500} height={500} alt="No Image Found" className="w-full h-auto object-cover" />
                </motion.div>
              </motion.section>

              {/* Testimonials */}
              <motion.section
                className="relative z-50 bg-white px-6 sm:px-10 py-10 sm:py-20"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
              >
                <motion.h3 className="text-[#601a89] text-4xl sm:text-5xl md:text-[60px] mb-6 sm:mb-10">What My Clients Say?</motion.h3>

                {/* Loader when fetching */}
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    {/* Spinner: use border with top color same as primary (#601a89) */}
                    <div
                      className="w-12 h-12 rounded-full animate-spin mb-4"
                      style={{
                        border: "4px solid rgba(96,26,137,0.18)",
                        borderTopColor: "#601a89",
                      }}
                      aria-hidden
                    />
                    <div className="text-[#601a89] font-medium">Loading testimonials...</div>
                  </div>
                ) : feedbacks.length === 0 ? (
                  <motion.p className="text-gray-600" variants={fadeIn}>No feedback yet.</motion.p>
                ) : (
                  <motion.div className="relative flex items-center" variants={fadeIn}>
                    {page > 0 && (
                      <motion.button onClick={goPrev} whileTap={{ scale: 0.95 }} className="absolute -left-6 top-1/2 -translate-y-1/2 text-[#601a89] text-4xl sm:text-5xl">‹</motion.button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
                      {visibleFeedbacks.map((fb) => {
                        const href = normalizeUrl(fb.website_url);
                        return (
                          <motion.article
                            key={fb.id}
                            className="border border-[#601a89] p-4 sm:p-6 rounded-lg shadow-sm bg-white flex flex-col justify-between gap-4 min-h-[15rem] sm:min-h-[20rem]"
                            variants={cardMotion}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            whileHover="hover"
                            whileTap={{ scale: 0.99 }}
                          >
                            {href ? (
                              <Link href={href} target="_blank" rel="noopener noreferrer" className="text-[#601a89] text-sm sm:text-[15px] font-semibold">
                                {fb.website_url.replace(/^https?:\/\//, "")}
                              </Link>
                            ) : (
                              <span className="text-gray-400 text-sm sm:text-[15px] font-semibold">No website</span>
                            )}
                            <div className="flex-1 flex flex-col justify-start">
                              <div className="flex gap-1 mb-3">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <span key={i} className={i < (Number(fb.rating) || 0) ? "text-yellow-500" : "text-gray-300"}>★</span>
                                ))}
                              </div>
                              <p className="text-gray-800 italic text-base sm:text-lg md:text-[18px] font-semibold leading-relaxed">"{fb.comments}"</p>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-4">– {fb.client_name}</p>
                          </motion.article>
                        );
                      })}
                    </div>

                    {page < pageCount - 1 && (
                      <motion.button onClick={goNext} whileTap={{ scale: 0.95 }} className="absolute -right-6 top-1/2 -translate-y-1/2 text-[#601a89] text-4xl sm:text-5xl">›</motion.button>
                    )}
                  </motion.div>
                )}
              </motion.section>

              {/* Contact + Services Tiles */}
              <motion.div
                className="flex flex-col sm:flex-row w-full h-[300px] relative z-50"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
              >
                <motion.div
                  onClick={() => onOpenPanel?.(6)}
                  className="bg-gradient-to-r from-[#313fd9] to-[#032e70] w-full sm:w-1/2 flex flex-col justify-between cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between p-5">
                    <div />
                    <Image src="/contact-icon.webp" width={80} height={80} alt="No Icon Found" className="sm:w-[120px] sm:h-[120px]" />
                  </div>
                  <div className="text-4xl sm:text-6xl md:text-7xl text-white px-4 sm:px-5 pb-2 sm:pb-5">Contact</div>
                </motion.div>

                <motion.div
                  onClick={() => onOpenPanel?.(3)}
                  className="bg-gradient-to-r from-[#ff9100] to-[#ff1744] w-full sm:w-1/2 flex flex-col justify-between cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex p-5">
                    <Image src="/services-icon.webp" width={80} height={80} alt="No Icon Found" className="sm:w-[120px] sm:h-[120px]" />
                  </div>
                  <div className="text-4xl sm:text-6xl md:text-7xl text-white flex justify-end px-4 sm:px-5 pb-2 sm:pb-5">Services</div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default About;
