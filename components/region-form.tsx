// "use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const suggestions = ["India", "Italian"];

interface RegionFormProps {
  onSubmit: (region: string) => void;
  isGenerating: boolean;
}

// export default function RegionForm({
//   onSubmit,
//   isGenerating,
// }: RegionFormProps) {
//   const [region, setRegion] = useState("");
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (region.trim() && !isGenerating) {
//       onSubmit(region);
//     }
//   };

//   const handleSuggestionClick = (suggestion: string) => {
//     setRegion(suggestion);
//     setShowSuggestions(false);
//   };

//   return (
//     <div className="backdrop-blur-md bg-black/30 rounded-2xl p-6 border border-white/10 shadow-xl">
//       <h2 className="text-2xl font-playfair mb-6 text-gray-100">Regions</h2>

//       <form onSubmit={handleSubmit}>
//         <div className="relative">
//           <Label
//             htmlFor="ingredients"
//             className="text-sm text-gray-300 mb-2 block"
//           >
//             Enter region
//           </Label>
//           <Input
//             id="ingredients"
//             value={region}
//             onChange={(e) => setRegion(e.target.value)}
//             onFocus={() => setShowSuggestions(true)}
//             onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
//             className="bg-black/50 border-white/20 focus:border-amber-300/50 text-gray-100"
//             placeholder="e.g., India, Italian, Middle Eastern"
//           />

//           {showSuggestions && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="absolute z-10 mt-1 w-full bg-gray-800/90 backdrop-blur-sm rounded-md shadow-lg border border-white/10"
//             >
//               <ul className="py-1 text-sm">
//                 {suggestions.map((suggestion, index) => (
//                   <li
//                     key={index}
//                     className="px-3 py-2 hover:bg-white/10 cursor-pointer text-gray-300"
//                     onClick={() => handleSuggestionClick(suggestion)}
//                   >
//                     {suggestion}
//                   </li>
//                 ))}
//               </ul>
//             </motion.div>
//           )}
//         </div>

//         <Button
//           type="submit"
//           className="w-full mt-6 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-medium py-2 px-4 rounded-md transition-all duration-300"
//           disabled={!region.trim() || isGenerating}
//         >
//           {isGenerating ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Conjuring Recipe...
//             </>
//           ) : (
//             "Conjure Recipe"
//           )}
//         </Button>
//       </form>
//     </div>
//   );
// }

export default function RegionForm({ onSubmit }: RegionFormProps) {
  const [region, setRegion] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (value: string) => {
    setRegion(value);
    onSubmit(value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setRegion(suggestion);
    onSubmit(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="backdrop-blur-md bg-black/30 rounded-2xl p-6 border border-white/10 shadow-xl">
      <h2 className="text-2xl font-playfair mb-6 text-gray-100">Regions</h2>

      <div className="relative">
        <Label htmlFor="region" className="text-sm text-gray-300 mb-2 block">
          Enter region
        </Label>
        <Input
          id="region"
          value={region}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="bg-black/50 border-white/20 focus:border-amber-300/50 text-gray-100"
          placeholder="e.g., India, Italian, Middle Eastern"
        />

        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-10 mt-1 w-full bg-gray-800/90 backdrop-blur-sm rounded-md shadow-lg border border-white/10"
          >
            <ul className="py-1 text-sm">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-3 py-2 hover:bg-white/10 cursor-pointer text-gray-300"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
}
