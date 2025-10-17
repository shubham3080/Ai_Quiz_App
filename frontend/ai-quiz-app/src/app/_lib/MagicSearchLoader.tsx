import { Player } from "@lottiefiles/react-lottie-player";
import searchingAnimation from "../../../public/loader.json"; // Adjust path to where you saved it
import { motion } from "framer-motion";
export function MagicSearchLoader({ text = "⚡ Fetching best results for you..." }: { text?:string }) {
  const words = ["Fetching", "best", "results", "for", "you..."];
  return (
    <div className="text-center py-8">
      <Player
        autoplay
        loop
        src={searchingAnimation}
        style={{ height: "200px", width: "200px" }}
      />
      <motion.p
        className="text-gray-600 font-medium text-lg mt-4"
        animate={{
          opacity: [0.5, 1, 0.5],
          scale: [0.98, 1, 0.98],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.p>
    </div>
  );
}
