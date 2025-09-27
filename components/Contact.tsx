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

const Contact: React.FC<Props> = ({
  isOpen = false,
  onToggle = () => {},
  label = "Contact",
  onOpenPanel,
}) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [page, setPage] = useState(0);

  // ref for the white Contact section
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

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setConsent(false);
  };

  const validateEmail = (em: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.trim());

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Please fill all required fields (name, email, message).");
      return;
    }
    if (!validateEmail(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!consent) {
      setErrorMsg("Please agree to the Terms & Conditions and Privacy Policy before sending.");
      return;
    }

    setLoading(true);
    try {
      const payload: Record<string, any> = {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        created_at: new Date().toISOString(),
        consent: true,
      };
      // include phone only if provided
      if (phone.trim()) payload.phone = phone.trim();

      const { data, error } = await supabaseBrowser.from("messages").insert([payload]);

      if (error) {
        console.error("Supabase insert error:", error);
        setErrorMsg("Something went wrong while sending your message. Please try again.");
      } else {
        setSuccessMsg("Thanks! Your message has been sent.");
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      aria-expanded={isOpen}
      className="relative group h-full w-full text-white focus:outline-none"
    >
      <AnimatePresence initial={false} mode="wait">
        {!isOpen ? (
          <motion.div
            key="collapsed-Contact"
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
                src="/contact-icon.webp"
                width={60}
                height={60}
                alt="no icon found"
                className="rotate-180 sm:w-[100px] sm:h-[100px]"
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="expanded-Contact"
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
                className="sticky top-0 min-h-screen z-40 bg-gradient-to-t from-[#313fd9] to-[#032e70]"
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
                      className={`opacity-95 ${acme.className} text-3xl sm:text-5xl md:text-[60px] text-left md:max-w-2xl lg:max-w-2xl`}
                    >
                      Let's connect and explore how we can work together to bring your vision to life.
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
                    Contact
                  </motion.div>
                </div>
              </motion.div>

              {/* Contact Section */}
              <motion.section
                ref={nextSectionRef}
                className="relative z-50 bg-white text-start px-6 sm:px-10 py-10 sm:py-20 flex flex-col md:flex-row gap-8 md:gap-10 justify-between items-start"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
              >
                <div className="w-full md:w-1/2">
                  <div className="text-[#032e70] text-4xl sm:text-5xl md:text-[60px] mb-6 sm:mb-10 md:max-w-2xl lg:max-w-2xl">
                    Say hello and let's discuss your next project.
                  </div>
                  <p className="text-gray-600 mb-6 max-w-xl text-xl font-normal">
                    I'm available for freelance projects, collaborations, and full-time opportunities. Drop a message below — I usually reply within 24–48 hours.
                  </p>

                  <div className="text-sm text-gray-700">
                    <strong>Email:</strong> <a className="text-[#032e70] underline" href="mailto:bharat.nanavathula@gmail.com">bharat.nanavathula@gmail.com</a>
                    <br />
                    <strong>Location:</strong> Hyderabad, India
                  </div>
                </div>

                {/* Form */}
                <div className="w-full md:w-1/2">
                  <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 border border-gray-100">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-1 text-lg border rounded-md focus:outline-none focus:ring-1 focus:ring-[#032e70] text-gray-900"
                        placeholder="Your name"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-1 text-lg border rounded-md focus:outline-none focus:ring-1 focus:ring-[#032e70] text-gray-900"
                        placeholder="you@company.com"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">Phone (optional)</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-1 text-lg border rounded-md focus:outline-none focus:ring-1 focus:ring-[#032e70] text-gray-900"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">Message</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-1 text-lg border rounded-md focus:outline-none focus:ring-1 focus:ring-[#032e70] text-gray-900"
                        placeholder="Tell me about your project..."
                        required
                      />
                    </div>

                    <div className="mb-4 flex items-start gap-3">
                      <input
                        id="consent-checkbox"
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-1 h-4 w-4 text-[#032e70] border-gray-300 rounded"
                        aria-describedby="consent-desc"
                      />
                      <label htmlFor="consent-checkbox" className="text-sm text-gray-700">
                        By sending the form you agree to the{" "}
                        <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#032e70] underline">Terms &amp; Conditions</a>{" "}
                        and{" "}
                        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#032e70] underline">Privacy Policy</a>.
                      </label>
                    </div>

                    {errorMsg && <div className="text-sm text-red-600 mb-3">{errorMsg}</div>}
                    {successMsg && <div className="text-sm text-green-600 mb-3">{successMsg}</div>}

                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-[#032e70] text-white rounded-md shadow hover:opacity-95 disabled:opacity-60 mt-5"
                      >
                        {loading ? (
                          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" opacity="0.2" />
                            <path d="M22 12a10 10 0 00-10-10" stroke="white" strokeWidth="4" strokeLinecap="round" />
                          </svg>
                        ) : null}
                        <span className="text-lg">{loading ? "Sending..." : "Send Message"}</span>
                      </button>
                    </div>
                  </form>
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
                      src="/Contact-icon.webp"
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

export default Contact;
