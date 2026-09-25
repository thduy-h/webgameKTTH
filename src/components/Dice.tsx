"use client";
import { motion } from "framer-motion";
export function Dice({ value, rolling }: { value: number; rolling: boolean }) {
  return (
    <motion.div
      className="dice"
      aria-label={`Xúc xắc: ${value}`}
      animate={
        rolling ? { rotate: [0, 180, 360], scale: [1, 1.15, 1] } : { rotate: 0 }
      }
      transition={{ duration: 0.55 }}
    >
      {["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"][value - 1]}
    </motion.div>
  );
}
