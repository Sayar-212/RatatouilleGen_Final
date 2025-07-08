"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface IngredientFormProps {
  onSubmit: (ingredients: string) => void;
  isGenerating: boolean;
}

export default function IngredientForm({
  onSubmit,
  isGenerating,
}: IngredientFormProps) {
  const [ingredients, setIngredients] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [allIngredients, setAllIngredients] = useState<string[]>([]);

  useEffect(() => {
    import('../data/ingredients.json')
      .then(data => setAllIngredients(data.default));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIngredients(value);
    
    const lastCommaIndex = value.lastIndexOf(',');
    const currentFragment = value.substring(lastCommaIndex + 1).trim().toLowerCase();
    
    if (currentFragment.length > 0) {
      const matches = allIngredients.filter(item => 
        item.toLowerCase().startsWith(currentFragment)
      ).slice(0, 8);
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const lastCommaIndex = ingredients.lastIndexOf(',');
    const beforeLastComma = lastCommaIndex >= 0 ? ingredients.substring(0, lastCommaIndex + 1) : '';
    setIngredients(beforeLastComma + (beforeLastComma ? ' ' : '') + suggestion + ', ');
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredients.trim() && !isGenerating) {
      onSubmit(ingredients);
    }
  };

  return (
    <div className="backdrop-blur-md bg-black/30 rounded-2xl p-6 border border-white/10 shadow-xl">
      <h2 className="text-2xl font-playfair mb-6 text-gray-100">
        Ingredients Palette
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Label
            htmlFor="ingredients"
            className="text-sm text-gray-300 mb-2 block"
          >
            Enter ingredients (comma-separated)
          </Label>
          <Input
            id="ingredients"
            value={ingredients}
            onChange={handleChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="bg-black/50 border-white/20 focus:border-amber-300/50 text-gray-100"
            placeholder="e.g., tomatoes, basil, mozzarella"
          />

          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-[100] mt-1 w-full max-h-56 overflow-y-auto bg-gray-800/90 backdrop-blur-sm rounded-md shadow-lg border border-white/10"
            >
              <ul className="py-1 text-sm">
                {suggestions.map((item: string, index: number) => (
                  <li
                    key={index}
                    className="px-3 py-2 hover:bg-white/10 cursor-pointer text-gray-300"
                    onClick={() => handleSuggestionClick(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full mt-6 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-medium py-2 px-4 rounded-md transition-all duration-300"
          disabled={!ingredients.trim() || isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Conjuring Recipe...
            </>
          ) : (
            "Conjure Recipe"
          )}
        </Button>
      </form>
    </div>
  );
}