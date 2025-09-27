"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, Variants } from "framer-motion";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const CountUp: React.FC<{
  end: number;
  duration?: number;
  suffix?: string;
  className?: string;
}> = ({ end, duration = 900, suffix = "", className = "" }) => {
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

const StatsSection: React.FC = () => {
  return (
    <motion.section
      className="relative z-50 bg-white text-start px-6 sm:px-10 py-10 sm:py-20"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="">
        <div>
          <h3 className="text-[#006400] text-4xl sm:text-5xl md:text-[48px] mb-6">
            Awesome stats
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl text-2xl">
            I craft web products that people love to use — balancing
            elegant design with engineering that scales. From
            prototypes to production, I ship reliable, maintainable
            solutions.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8">
            <div className="flex flex-col items-start">
              <div
                className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg,#7c0cff,#ff2d7a)",
                }}
              >
                <CountUp
                  end={50}
                  duration={1100}
                  suffix="+ "
                  className="inline-block"
                />
              </div>
              <div className="text-gray-500 mt-2">
                Projects completed
              </div>
            </div>

            <div className="flex flex-col items-start">
              <div
                className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg,#ff9a2c,#ff3b6b)",
                }}
              >
                <CountUp
                  end={40}
                  duration={1100}
                  suffix="+ "
                  className="inline-block"
                />
              </div>
              <div className="text-gray-500 mt-2">Happy clients</div>
            </div>

            <div className="flex flex-col items-start">
              <div
                className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg,#3a7bff,#55b0ff)",
                }}
              >
                <CountUp
                  end={3}
                  duration={900}
                  suffix="+ "
                  className="inline-block"
                />
              </div>
              <div className="text-gray-500 mt-2">
                Countries served
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default StatsSection;