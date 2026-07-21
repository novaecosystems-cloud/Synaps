"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, FileText, Mail, Cloud, Users, Box, MessageSquare } from "lucide-react";

const items = [
  { id: 1, name: "CRM", icon: <Users size={48} />, color: "bg-blue-500" },
  { id: 2, name: "ERP", icon: <Box size={48} />, color: "bg-orange-500" },
  { id: 3, name: "Emails", icon: <Mail size={48} />, color: "bg-red-500" },
  { id: 4, name: "Slack", icon: <MessageSquare size={48} />, color: "bg-purple-500" },
  { id: 5, name: "JIRA", icon: <FileText size={48} />, color: "bg-blue-600" },
  { id: 6, name: "Databases", icon: <Database size={48} />, color: "bg-emerald-500" },
  { id: 7, name: "Cloud", icon: <Cloud size={48} />, color: "bg-cyan-500" },
];

export default function CoverflowGallery() {
  const [currentIndex, setCurrentIndex] = useState(3);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[400px] flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full flex items-center justify-center perspective-1000">
        <AnimatePresence initial={false}>
          {items.map((item, i) => {
            // Calculate relative position
            let offset = i - currentIndex;
            if (offset > items.length / 2) offset -= items.length;
            if (offset < -items.length / 2) offset += items.length;

            const isCenter = offset === 0;
            const x = offset * 120;
            const z = -Math.abs(offset) * 150;
            const rotateY = offset * -20;
            const opacity = 1 - Math.abs(offset) * 0.2;

            if (Math.abs(offset) > 3) return null; // Hide far items

            return (
              <motion.div
                key={item.id}
                initial={false}
                animate={{
                  x,
                  z,
                  rotateY,
                  opacity,
                  scale: isCenter ? 1.2 : 0.9,
                  zIndex: items.length - Math.abs(offset),
                }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                className="absolute transform-style-3d cursor-pointer"
                onClick={() => setCurrentIndex(i)}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <div 
                  className={`w-40 h-56 rounded-2xl ${item.color} flex flex-col items-center justify-center text-white shadow-2xl overflow-hidden`}
                  style={{
                    boxShadow: isCenter ? "0 20px 40px -10px rgba(0,0,0,0.5)" : "0 10px 20px -10px rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <div className="opacity-90">{item.icon}</div>
                  <div className="mt-4 font-semibold tracking-wider">{item.name}</div>
                  
                  {/* Glass reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform -translate-x-full animate-[shimmer_3s_infinite]" />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      {/* Auto cycle invisible trigger or manual buttons */}
      <button onClick={handlePrev} className="absolute left-4 z-50 btn btn-circle btn-ghost text-white">&lt;</button>
      <button onClick={handleNext} className="absolute right-4 z-50 btn btn-circle btn-ghost text-white">&gt;</button>
    </div>
  );
}
