'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "I had no idea my will was missing critical provisions. This tool found issues my attorney missed and saved my family from potential legal battles.",
    author: "Sarah M.",
    role: "Business Owner, California",
  },
  {
    quote: "The peace of mind is incredible. I can finally stop worrying about whether my estate plan actually does what I think it does.",
    author: "Michael R.",
    role: "Retired Teacher, Florida",
  },
  {
    quote: "As a financial advisor, I recommend this to all my clients. It's like having an estate attorney on call 24/7.",
    author: "Jennifer L.",
    role: "CFP, New York",
  },
];

export default function TestimonialSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const navigate = (dir: number) => {
    setDirection(dir);
    setCurrent((prev) => {
      if (dir === 1) return (prev + 1) % testimonials.length;
      return prev === 0 ? testimonials.length - 1 : prev - 1;
    });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <section className="py-24 bg-[#FAF9F7]">
      <div className="container max-w-4xl">
        <div className="relative">
          {/* Quote icon */}
          <div className="absolute -top-8 left-0 w-16 h-16 rounded-full bg-[#FF7759]/10 flex items-center justify-center">
            <Quote className="w-8 h-8 text-[#FF7759]" />
          </div>

          {/* Testimonial content */}
          <div className="relative h-[280px] overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex flex-col justify-center"
              >
                <blockquote className="text-[clamp(24px,3vw,32px)] font-normal leading-[1.4] text-[#1D1D1B] mb-8">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-4">
                  {/* Avatar placeholder */}
                  <div className="w-12 h-12 rounded-full bg-[#1D1D1B]/10" />
                  <div>
                    <div className="font-medium text-[#1D1D1B]">
                      {testimonials[current].author}
                    </div>
                    <div className="text-sm text-[#6B6B5E]">
                      {testimonials[current].role}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > current ? 1 : -1);
                    setCurrent(index);
                  }}
                  className={`
                    h-2 rounded-full transition-all duration-300
                    ${index === current ? 'w-8 bg-[#FF7759]' : 'w-2 bg-[#1D1D1B]/20 hover:bg-[#1D1D1B]/40'}
                  `}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-2">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full border border-[rgba(29,29,27,0.15)] flex items-center justify-center hover:bg-white hover:border-[rgba(29,29,27,0.25)] transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-[#1D1D1B]" />
              </button>
              <button
                onClick={() => navigate(1)}
                className="w-10 h-10 rounded-full border border-[rgba(29,29,27,0.15)] flex items-center justify-center hover:bg-white hover:border-[rgba(29,29,27,0.25)] transition-all"
              >
                <ChevronRight className="w-5 h-5 text-[#1D1D1B]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
