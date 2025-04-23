"use client";

import React from "react";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -5 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
      type: "spring",
      stiffness: 120,
    },
  },
};

const pulseVariants = {
  animate: {
    opacity: [0.3, 0.7, 0.3],
    scale: [1, 1.08, 1],
    transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
  },
};

const groundVariants = {
  animate: {
    x: [-3, 3, -3],
    scaleY: [1, 1.02, 1],
    transition: { duration: 0.35, repeat: Infinity, ease: "easeInOut" },
  },
};

const cameraShakeVariants = {
  animate: {
    y: [0, -1, 0, 1, 0],
    x: [0, 1, 0, -1, 0],
    transition: { duration: 0.4, repeat: Infinity, ease: "easeInOut" },
  },
};

const Loader = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="
        fixed inset-0 flex items-center justify-center
        bg-gradient-to-b from-gray-700 to-blue-400/10 backdrop-blur-xl
      "
      role="status"
      aria-label="Chasing"
    >
      <motion.div
        variants={cameraShakeVariants}
        animate="animate"
        className="
          relative p-10 bg-gray-600/80 border border-blue-400/30
          rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.3)]
          flex flex-col items-center
        "
      >
        {/* Running Cat and Laser Animation */}
        <div className="relative w-36 h-24 mb-6 flex items-center">
          <style jsx>{`
            .laser {
              width: 24px;
              height: 4px;
              background: linear-gradient(to right, #fb7185, #f43f5e);
              border-radius: 2px;
              position: absolute;
              top: 40px;
              left: 90px;
              box-shadow: 0 0 12px rgba(244, 63, 94, 0.9),
                0 0 20px rgba(244, 63, 94, 0.6);
              animation: chase 0.5s ease-in-out infinite;
            }
            .laser::after {
              content: "";
              position: absolute;
              width: 48px;
              height: 4px;
              background: linear-gradient(
                to left,
                rgba(251, 113, 133, 0.5),
                transparent
              );
              left: -48px;
              border-radius: 2px;
              opacity: 0.7;
              animation: trail 0.5s ease-in-out infinite;
            }
            @keyframes chase {
              0% {
                transform: translateX(0) scale(1);
                opacity: 0.6;
              }
              50% {
                transform: translateX(10px) scale(1.15);
                opacity: 1;
              }
              100% {
                transform: translateX(0) scale(1);
                opacity: 0.6;
              }
            }
            @keyframes trail {
              0% {
                opacity: 0.5;
                transform: scaleX(1);
              }
              50% {
                opacity: 0.8;
                transform: scaleX(1.2);
              }
              100% {
                opacity: 0.5;
                transform: scaleX(1);
              }
            }
            .ground {
              width: 120%;
              height: 2px;
              background: linear-gradient(to right, #6b7280, #9ca3af);
              position: absolute;
              bottom: -2px;
              left: -10%;
              opacity: 0.4;
              border-radius: 1px;
              transform: perspective(500px) rotateX(60deg);
            }
            .ground-shadow {
              width: 80%;
              height: 6px;
              background: radial-gradient(
                ellipse at center,
                rgba(75, 85, 99, 0.3) 0%,
                transparent 70%
              );
              position: absolute;
              bottom: -4px;
              left: 10%;
              filter: blur(3px);
              border-radius: 3px;
            }
          `}</style>

          {/* Laser Beam */}
          <motion.div
            className="laser"
            animate={{ rotate: [0, 2, 0, -2, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Running Cat (SVG) */}
          <motion.div
            className="absolute w-20 h-20 left-6 top-2"
            animate={{ y: [0, -8, 0], scaleY: [1, 0.95, 1] }}
            transition={{ duration: 0.3, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <style>
                {`
                  .cat-body { animation: bounce 0.3s infinite; }
                  .cat-head { animation: tilt 0.6s infinite; }
                  .cat-leg-front, .cat-leg-back { animation: run-front 0.3s infinite; }
                  .cat-leg-front-2, .cat-leg-back-2 { animation: run-back 0.3s infinite 0.15s; }
                  .cat-tail { animation: wag 0.5s ease-in-out infinite alternate; }
                  .cat-ear { animation: twitch 1.2s infinite; }
                  @keyframes bounce {
                    0%, 100% { transform: translateY(0) scaleY(1); }
                    50% { transform: translateY(-3px) scaleY(0.98); }
                  }
                  @keyframes tilt {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(2deg); }
                  }
                  @keyframes run-front {
                    0% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-6px) rotate(25deg); }
                    100% { transform: translateY(0) rotate(0deg); }
                  }
                  @keyframes run-back {
                    0% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-6px) rotate(-25deg); }
                    100% { transform: translateY(0) rotate(0deg); }
                  }
                  @keyframes wag {
                    0% { transform: rotate(-12deg); }
                    100% { transform: rotate(12deg); }
                  }
                  @keyframes twitch {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-1px); }
                  }
                `}
              </style>
              {/* Cat Body */}
              <rect
                className="cat-body"
                x="20"
                y="32"
                width="40"
                height="20"
                rx="10"
                fill="#4B5563"
              />
              {/* Cat Head */}
              <circle
                className="cat-head"
                cx="60"
                cy="28"
                r="10"
                fill="#4B5563"
              />
              {/* Cat Ear */}
              <path
                className="cat-ear"
                d="M58 20L62 14L66 20H58Z"
                fill="#4B5563"
              />
              {/* Cat Tail */}
              <rect
                className="cat-tail"
                x="14"
                y="40"
                width="20"
                height="5"
                rx="2.5"
                fill="#4B5563"
                transform="rotate(-12 14 40)"
              />
              {/* Cat Legs */}
              <rect
                className="cat-leg-front"
                x="30"
                y="48"
                width="8"
                height="14"
                rx="4"
                fill="#4B5563"
              />
              <rect
                className="cat-leg-front-2"
                x="42"
                y="48"
                width="8"
                height="14"
                rx="4"
                fill="#4B5563"
              />
              <rect
                className="cat-leg-back"
                x="22"
                y="48"
                width="8"
                height="14"
                rx="4"
                fill="#4B5563"
              />
              <rect
                className="cat-leg-back-2"
                x="50"
                y="48"
                width="8"
                height="14"
                rx="4"
                fill="#4B5563"
              />
              {/* Cat Eyes */}
              <circle cx="58" cy="28" r="2.5" fill="#F3F4F6">
                <animate
                  attributeName="r"
                  values="2.5;3;2.5"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="64" cy="28" r="2.5" fill="#F3F4F6">
                <animate
                  attributeName="r"
                  values="2.5;3;2.5"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
              {/* Cat Whiskers */}
              <path
                d="M56 32C54 32 52 30 52 28"
                stroke="#F3F4F6"
                strokeWidth="1"
                strokeLinecap="round"
              />
              <path
                d="M66 32C68 32 70 30 70 28"
                stroke="#F3F4F6"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>

          {/* Ground Line and Shadow */}
          <motion.div
            variants={groundVariants}
            animate="animate"
            className="ground"
          />
          <motion.div
            variants={groundVariants}
            animate="animate"
            className="ground-shadow"
          />
        </div>

        {/* Pulsing Background */}
        <motion.div
          variants={pulseVariants}
          animate="animate"
          className="
            absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10
            rounded-3xl
          "
        />

        {/* Chasing Text */}
        <motion.p
          className="
            text-sm font-semibold bg-clip-text text-transparent
            bg-gradient-to-r from-blue-400 to-purple-400
          "
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Chasing...
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Loader;
