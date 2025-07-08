"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/header";
import IngredientForm from "@/components/ingredient-form";
import RecipeCard from "@/components/recipe-card";
import RegionForm from "@/components/region-form";
import { Button } from "@/components/ui/button";
import type { Recipe } from "@/lib/types";
import ingredientsData from "@/data/ingredients.json";

function parseRecipeResponse(rawText: string): Recipe {
  const nameMatch = rawText.match(/Recipe Title:\s*(.*)/);
  const name = nameMatch ? nameMatch[1].trim() : "Unknown";

  const ingredients: { name: string; emoji: string }[] = [];
  const steps: string[] = [];
  let servingSuggestion = "";

  const lines = rawText.split("\n");
  // ...parsing logic...
  return {
    name,
    cookingTime: "30",
    difficulty: "Medium",
    ingredients,
    steps,
    servingSuggestion,
    taste: "",
    regionalContext: "",
  };
}

//   //   setTimeout(() => {
//   //     const newRecipe = generateRecipe(ingredients);
//   //     console.log("Ingredients",ingredients);
//   //     setRecipe(newRecipe);
//   //     console.log("Recipe",recipe);
//   //     setIsGenerating(false);
//   //   }, 2000);
//   // };
//   function parseRecipeResponse(rawText: string): Recipe {
//     const nameMatch = rawText.match(/Recipe Title:\s*(.*)/);
//     const name = nameMatch ? nameMatch[1].trim() : "Unknown";

//     const ingredients: { name: string; emoji: string }[] = [];
//     const steps: string[] = [];
//     let servingSuggestion = "";

//     const lines = rawText.split("\n");

//     let inIngredients = false;
//     let inSteps = false;

//     for (const line of lines) {
//       const trimmed = line.trim();

//       if (/^ingredient list/i.test(trimmed)) {
//         inIngredients = true;
//         inSteps = false;
//         continue;
//       }

//       if (/^preparation steps/i.test(trimmed)) {
//         inSteps = true;
//         inIngredients = false;
//         continue;
//       }

//       if (/^chef'?s notes/i.test(trimmed)) {
//         inIngredients = false;
//         inSteps = false;
//         servingSuggestion += trimmed;
//         continue;
//       }

//       if (inIngredients && trimmed.startsWith("*")) {
//         ingredients.push({
//           name: trimmed.replace(/^\*\s*/, ""),
//           emoji: "🧂", // Optional: Replace with smarter emoji detection if needed
//         });
//       }

//       if (inSteps && /^\d+\./.test(trimmed)) {
//         steps.push(trimmed);
//       }
//     }

//     return {
//       name,
//       cookingTime: "30", // Default (or parse from Chef's Notes later)
//       difficulty: "Medium",
//       ingredients,
//       steps,
//       servingSuggestion,
//     };
//   }

//   const handleGenerateRecipe = async (object) => {
//     const ingredients = object.ingredients;
//     const region = object.region;
//     setIsGenerating(true);

//     // IMPORTANT: Change the backend URL here if your backend runs elsewhere
//     const response = await fetch("http://192.168.3.20:8000/generate-recipe", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         region: region, // use the selected region from the UI
//         ingredients: ingredients, // use the selected ingredients from the UI
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     const rawRecipeText = data.recipe;

//     const parsedRecipe = parseRecipeResponse(rawRecipeText);
//     console.log("Parsed Recipe",parsedRecipe);
//     setRecipe(parsedRecipe);
//     setIsGenerating(false);
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-rose-900">
//       <div className="container mx-auto px-4 py-8">
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Header />
//         </motion.div>

//         <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
//           <motion.div
//             className="lg:col-span-5"
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//           >
//             <IngredientForm
//               onSubmit={handleGenerateRecipe}
//               isGenerating={isGenerating}
//             />

//             <RegionForm
//               onSubmit={handleGenerateRecipe}
//               isGenerating={isGenerating}
//             />
//           </motion.div>

//           <motion.div
//             className="lg:col-span-7"
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5, delay: 0.4 }}
//           >
//             {recipe && <RecipeCard recipe={recipe} />}
//           </motion.div>
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.6 }}
//           className="mt-16"
//         >
//           <ExploreSection />
//   const [isGenerating, setIsGenerating] = useState(false);

//   function parseRecipeResponse(rawText: string): Recipe {
//     const lines = rawText.split("\n");

//     let name = "";
//     let taste = "";
//     let regionalContext = "";
//     let ingredients: { name: string; emoji: string }[] = [];
//     let steps: string[] = [];
//     let servingSuggestion = "";

//     let inIngredients = false;
//     let inSteps = false;

//     for (let i = 0; i < lines.length; i++) {
//       const line = lines[i].trim();

//       if (line.startsWith("Recipe Title:")) {
//         name = line.replace("Recipe Title:", "").trim();
//       } else if (line.startsWith("Taste:")) {
//         taste = line.replace("Taste:", "").trim();
//       } else if (line.startsWith("Regional Context:")) {
//         regionalContext = "";

//         i++; // move to next line and gather multi-line context
//         while (i < lines.length && lines[i].trim() !== "") {
//           regionalContext += lines[i].trim() + " ";
//           i++;
//         }
//         regionalContext = regionalContext.trim();
//       } else if (/^ingredient list/i.test(line)) {
//         inIngredients = true;
//         inSteps = false;
//       } else if (/^preparation steps/i.test(line)) {
//         inIngredients = false;
//         inSteps = true;
//       } else if (/^chef'?s notes/i.test(line)) {
//         inIngredients = false;
//         inSteps = false;

//         i++;
//         while (i < lines.length) {
//           servingSuggestion += lines[i].trim() + " ";
//           i++;
//         }
//         servingSuggestion = servingSuggestion.trim();
//       } else if (inIngredients && line.startsWith("*")) {
//         ingredients.push({
//           name: line.replace(/^\*\s*/, ""),
//           emoji: "🧂", // optionally dynamic
//         });
//       } else if (inSteps && /^\d+\./.test(line)) {
//         steps.push(line);
//       }
//     }

//     return {
//       name,
//       taste,
//       regionalContext,
//       ingredients,
//       steps,
//       servingSuggestion,
//       cookingTime: "30", // or parsed dynamically if available
//       difficulty: "Medium",
//     };
//   }

//   const handleGenerateRecipe = async () => {
//     if (!ingredients || !region) return;

//     setIsGenerating(true);

//     const response = await fetch("http://localhost:8000/generate-recipe", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ region, ingredients }),
//     });

//     const data = await response.json();
//     const rawRecipeText = data.recipe;

//     const parsedRecipe = parseRecipeResponse(rawRecipeText);
//     console.log("Parsed Recipe", parsedRecipe);
//     setRecipe(parsedRecipe);
//     setIsGenerating(false);
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-rose-900">
//       <div className="container mx-auto px-4 py-8">
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Header />
//         </motion.div>

//         <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
//           <div className="lg:col-span-5 space-y-20">
//             <IngredientForm
//               onSubmit={(value) => setIngredients(value)}
//               isGenerating={isGenerating}
//             />

//             <RegionForm
//               onSubmit={(value) => setRegion(value)}
//               isGenerating={isGenerating}
//             />

//             <Button
//               onClick={handleGenerateRecipe}
//               className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-4 rounded-md"
//               disabled={!region || !ingredients || isGenerating}
//             >
//               {isGenerating ? "Conjuring Recipe..." : "Generate Recipe"}
//             </Button>
//           </div>

//           <motion.div
//             className="lg:col-span-7"
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5, delay: 0.4 }}
//           >
//             {recipe && <RecipeCard recipe={recipe} />}
//           </motion.div>
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.6 }}
//           className="mt-16"
//         >
//           {/* <ExploreSection /> */}
//         </motion.div>
//       </div>
//     </main>
//   );
// }

export default function Home() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [ingredients, setIngredients] = useState("");
  const [region, setRegion] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipeCount, setRecipeCount] = useState(0);
  const [filteredIngredients, setFilteredIngredients] = useState<string[]>([]);
  const [filteredRegions, setFilteredRegions] = useState<string[]>([]);
  
  const regions = [
    "India", "China", "Vietnam", "Thailand", "Japan", "Korea", "Italy", "France", "Spain", "Greece", "Mexico", "Brazil", "Peru", "America", "Britain", "Germany", "Russia", "Turkey", "Lebanon", "Morocco", "Ethiopia", "Nigeria", "South Africa", "Australia", "Mediterranean", "Middle East", "Southeast Asia", "Caribbean", "Louisiana", "Texas", "Fusion", "Continental", "Nordic", "Scandinavia", "Eastern Europe", "Central Asia", "Mongolia", "Tibet", "Nepal", "Sri Lanka", "Pakistan", "Bangladesh", "Afghanistan", "Iran", "Iraq", "Israel", "Palestine", "Syria", "Jordan", "Egypt", "Sudan", "Algeria", "Tunisia", "Libya", "Ghana", "Kenya", "Tanzania", "Uganda", "Zimbabwe", "Botswana", "Namibia", "Zambia", "Malawi", "Mozambique", "Madagascar", "Mauritius", "Seychelles", "Reunion", "Comoros", "Djibouti", "Somalia", "Eritrea", "Rwanda", "Burundi", "Congo", "Cameroon", "Chad", "Central Africa", "Gabon", "Equatorial Guinea", "Sao Tome", "Cape Verde", "Guinea", "Sierra Leone", "Liberia", "Ivory Coast", "Burkina Faso", "Mali", "Niger", "Senegal", "Gambia", "Guinea-Bissau", "Mauritania"
  ];

  useEffect(() => {
    fetch('/api/recipe-count')
      .then(res => res.json())
      .then(data => setRecipeCount(data.count))
      .catch(() => setRecipeCount(0));
  }, []);

  const searchFatSecretAPI = async (query: string) => {
    try {
      const response = await fetch(`/api/ingredients?search=${encodeURIComponent(query)}`);
      const data = await response.json();
      return data.ingredients || [];
    } catch (error) {
      console.error('FatSecret API error:', error);
      return [];
    }
  };

  const handleIngredientChange = async (value: string) => {
    setIngredients(value);
    const parts = value.split(',');
    const lastPart = parts[parts.length - 1].trim().toLowerCase();
    
    if (lastPart.length > 0) {
      // Local ingredients with comprehensive matching
      const regex = new RegExp(lastPart, 'i');
      const localMatches = ingredientsData.filter(ingredient => 
        regex.test(ingredient)
      );
      
      // API ingredients for comprehensive coverage
      const apiMatches = await searchFatSecretAPI(lastPart);
      
      // Combine suggestions with existing ingredients
      const existingParts = parts.slice(0, -1).map(p => p.trim()).filter(p => p.length > 0);
      const combined = [...localMatches, ...apiMatches];
      const unique = [...new Set(combined)];
      
      // Show only individual ingredient names
      setFilteredIngredients(unique);
    } else {
      setFilteredIngredients([]);
    }
  };

  function parseRecipeResponse(rawText: string): Recipe {
    if (!rawText || typeof rawText !== 'string') {
      return {
        name: "Error",
        taste: "Unable to parse",
        regionalContext: "Please try again",
        ingredients: [],
        steps: [],
        chefNotes: "Recipe generation failed",
        cookingTime: "0",
        difficulty: "Unknown",
      };
    }
    const lines = rawText.split("\n");

    let name = "";
    let taste = "";
    let regionalContext = "";
    let ingredients: { name: string; emoji: string }[] = [];
    let steps: string[] = [];
    let servingSuggestion = "";

    let currentSection = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Stop parsing if we hit FINAL VERIFICATION
      if (line.toUpperCase().includes("FINAL VERIFICATION")) {
        break;
      }

      // Section headers
      if (line.startsWith("Recipe Title:")) {
        name = line.replace("Recipe Title:", "").trim();
        currentSection = "";
      } else if (line.startsWith("Taste:") || line.startsWith("Taste Profile:")) {
        const tasteContent = line.replace(/^Taste( Profile)?:\s*/, "").trim();
        if (tasteContent) {
          taste = tasteContent;
          currentSection = "";
        } else {
          currentSection = "taste";
        }
      } else if (line.startsWith("Regional Context:")) {
        currentSection = "regionalContext";
        continue;
      } else if (/^ingredient list/i.test(line)) {
        currentSection = "ingredients";
        continue;
      } else if (/^preparation steps/i.test(line)) {
        currentSection = "steps";
        continue;
      } else if (/^chef'?s notes/i.test(line)) {
        currentSection = "servingSuggestion";
        continue;
      }

      // Section content
      if (currentSection === "taste" && line) {
        taste += line + " ";
      } else if (currentSection === "regionalContext" && line) {
        regionalContext += line + " ";
      } else if (currentSection === "ingredients" && line.startsWith("*")) {
        ingredients.push({
          name: line.replace(/^\*\s*/, ""),
          emoji: "🧂",
        });
      } else if (currentSection === "steps" && /^\d+\./.test(line)) {
        steps.push(line);
      } else if (currentSection === "servingSuggestion" && line) {
        servingSuggestion += line + " ";
      }
    }

    return {
      name: name || "Untitled Recipe",
      taste: taste.trim() || "Flavor profile not specified",
      regionalContext: regionalContext.trim() || "Regional context not provided",
      ingredients: ingredients.length > 0 ? ingredients : [{ name: "No ingredients specified", emoji: "🤷" }],
      steps: steps.length > 0 ? steps : ["No preparation steps provided"],
      servingSuggestion: servingSuggestion.trim() || "No serving suggestions available",
      cookingTime: "30",
      difficulty: "Medium",
    };
  }

  const handleGenerateRecipe = async () => {
    if (!ingredients || !region) return;
    setIsGenerating(true);

    // IMPORTANT: Change the backend URL here if your backend runs elsewhere
    const response = await fetch("http://192.168.3.20:8000/generate-recipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        region: region,
        ingredients: ingredients,
      }),
    });

    const data = await response.json();
    const parsedRecipe = parseRecipeResponse(data.recipe);
    console.log("Parsed Recipe", parsedRecipe);

    setRecipe(parsedRecipe);
    fetch('/api/recipe-count', { method: 'POST' })
      .then(res => res.json())
      .then(data => setRecipeCount(data.count))
      .catch(() => {});
    setIsGenerating(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-rose-50 dark:from-black dark:via-gray-900 dark:to-gray-800 font-sans relative overflow-hidden transition-colors duration-500">
      
      {/* Enhanced Header */}
      <Header recipeCount={recipeCount} />

      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-200/30 to-pink-200/30 dark:from-purple-600/10 dark:to-pink-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-rose-200/20 to-indigo-200/20 dark:from-rose-600/8 dark:to-indigo-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-fuchsia-100/20 to-purple-100/20 dark:from-fuchsia-600/8 dark:to-purple-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        {/* Floating Elements */}
        <motion.span initial={{ opacity: 0, y: 0, scale: 0.8 }} animate={{ opacity: 0.3, y: [0, -20, 0], scale: [0.8, 1.2, 0.8] }} transition={{ delay: 0, duration: 12, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="absolute left-8 top-32 text-2xl opacity-30">🍅</motion.span>
        <motion.span initial={{ opacity: 0, x: 0, scale: 0.8 }} animate={{ opacity: 0.3, x: [0, 20, 0], scale: [0.8, 1.2, 0.8] }} transition={{ delay: 2, duration: 14, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="absolute right-12 top-40 text-2xl opacity-30">🥦</motion.span>
        <motion.span initial={{ opacity: 0, y: 0, scale: 0.8 }} animate={{ opacity: 0.3, y: [0, 15, 0], scale: [0.8, 1.1, 0.8] }} transition={{ delay: 4, duration: 16, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="absolute left-1/4 bottom-32 text-2xl opacity-30">🧀</motion.span>
        <motion.span initial={{ opacity: 0, x: 0, scale: 0.8 }} animate={{ opacity: 0.3, x: [0, -18, 0], scale: [0.8, 1.1, 0.8] }} transition={{ delay: 6, duration: 18, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="absolute right-1/3 bottom-40 text-2xl opacity-30">🍋</motion.span>
      </div>


{/* Sample Recipes Section */}
<section className="max-w-6xl mx-auto w-full mb-24 px-4">
  <motion.h2 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="text-4xl md:text-5xl font-bold font-playfair text-center mb-12 text-slate-800 dark:text-white drop-shadow-lg flex items-center justify-center gap-4"
  >
    <span className="text-rose-500">🍽️</span> Sample Culinary Inspirations <span className="text-amber-500">✨</span>
  </motion.h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {[
      {
        name: 'Sunshine Ratatouille',
        desc: 'A vibrant medley of summer vegetables, slow-roasted with herbs and olive oil.',
        emoji: '🍆',
        color: 'from-amber-200 via-orange-200 to-rose-200',
      },
      {
        name: 'Paneer Tikka Pizza',
        desc: 'Fusion delight: Indian spices meet Italian crust, topped with smoky paneer.',
        emoji: '🍕',
        color: 'from-orange-200 via-rose-100 to-fuchsia-200',
      },
      {
        name: 'Lemon Herb Quinoa',
        desc: 'Zesty, protein-packed, and perfect for a light lunch or dinner.',
        emoji: '🍋',
        color: 'from-lime-100 via-emerald-100 to-teal-100',
      },
    ].map((sample, i) => (
      <motion.div
        key={sample.name}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * i, duration: 0.7, type: 'spring' }}
        viewport={{ once: true }}
        className={`rounded-3xl bg-gradient-to-br ${sample.color} shadow-xl p-7 flex flex-col items-center border-2 border-white/40 min-h-[220px]`}
      >
        <span className="text-4xl mb-2 drop-shadow-lg">{sample.emoji}</span>
        <h3 className="font-playfair text-xl font-bold mb-2 text-gray-800 text-center">{sample.name}</h3>
        <p className="text-gray-600 text-center text-base mb-2">{sample.desc}</p>
      </motion.div>
    ))}
  </div>
</section>

      {/* Input Card Section */}
      <section className="max-w-4xl mx-auto w-full mb-20 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white/60 backdrop-blur-3xl rounded-[3rem] shadow-2xl p-12 flex flex-col items-center border border-white/60 transition duration-500 hover:shadow-3xl hover:bg-white/70 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-400 opacity-60"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-rose-200/30 to-indigo-200/30 rounded-full blur-2xl"></div>
          <h2 className="relative text-3xl font-bold text-slate-800 mb-8 tracking-wide font-playfair flex items-center gap-3 z-10">
            <span className="text-rose-500 text-4xl drop-shadow-lg">🍲</span> Start Your Culinary Journey
          </h2>
          <div className="relative w-full flex flex-col md:flex-row gap-10 z-10">
            <div className="w-full md:w-1/2">
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-2">Ingredients</label>
                <div className="relative">
                  <input
                    type="text"
                    value={ingredients}
                    onChange={(e) => handleIngredientChange(e.target.value)}
                    placeholder="e.g., tomatoes, onions, garlic..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                  {filteredIngredients.length > 0 && (
                    <div className="absolute z-[9999] w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-2xl max-h-40 overflow-y-scroll" style={{ top: '100%', left: '0', right: '0' }}>
                      {filteredIngredients.map((ingredient, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-rose-50 dark:hover:bg-rose-900 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                          onClick={() => {
                            const parts = ingredients.split(',');
                            parts[parts.length - 1] = ingredient;
                            setIngredients(parts.join(', ').replace(/,\s*,/g, ',').trim());
                            setFilteredIngredients([]);
                          }}
                        >
                          {ingredient}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-2">Region/Cuisine</label>
                <div className="relative">
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => {
                      setRegion(e.target.value);
                      const query = e.target.value.toLowerCase();
                      if (query.length > 0) {
                        const matches = regions.filter(r => 
                          r.toLowerCase().includes(query)
                        );
                        setFilteredRegions(matches);
                      } else {
                        setFilteredRegions([]);
                      }
                    }}
                    placeholder="e.g., Italy, India, Mexico..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                  {filteredRegions.length > 0 && (
                    <div className="absolute z-[9999] w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-2xl max-h-40 overflow-y-scroll" style={{ top: '100%', left: '0', right: '0' }}>
                      {filteredRegions.map((regionItem, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-rose-50 dark:hover:bg-rose-900 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                          onClick={() => {
                            setRegion(regionItem);
                            setFilteredRegions([]);
                          }}
                        >
                          {regionItem}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Button
            onClick={handleGenerateRecipe}
            className="relative w-full mt-10 flex items-center justify-center gap-3 bg-gradient-to-r from-rose-500 via-fuchsia-600 to-indigo-500 hover:from-rose-600 hover:via-fuchsia-700 hover:to-indigo-600 text-white font-extrabold py-4 px-8 rounded-2xl text-lg shadow-2xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-105 hover:shadow-3xl z-10"
            disabled={!region || !ingredients || isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="animate-spin inline-block mr-2">🍽️</span> Conjuring a Recipe...
              </>
            ) : (
              <>
                <span className="inline-block">🔮</span> Generate Recipe
              </>
            )}
          </Button>
          <span className="relative mt-4 text-sm text-slate-600 italic font-medium z-10">Unleash culinary creativity with AI!</span>
        </motion.div>
      </section>

      {/* Modal Overlay for Recipe Output */}
      {recipe && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gradient-to-br from-black/80 via-purple-900/80 to-rose-900/80 backdrop-blur-lg animate-pulse-slow">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative bg-gradient-to-br from-[#1a1a2e]/90 via-[#23234e]/90 to-[#5f2c82]/90 rounded-3xl p-10 shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col border-4 border-transparent animate-glow"
            style={{ boxShadow: '0 0 80px 10px #ff80b5, 0 0 24px 2px #a890fe' }}
          >
            <div className="absolute inset-0 rounded-3xl border-4 border-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 pointer-events-none animate-border-glow"></div>
            <button
              className="absolute top-2 right-2 text-white bg-gradient-to-br from-rose-500 via-fuchsia-500 to-indigo-500 hover:from-rose-600 hover:to-indigo-600 rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow-lg border-2 border-white/20"
              onClick={() => setRecipe(null)}
              aria-label="Close Recipe"
              style={{ zIndex: 10 }}
            >
              ×
            </button>
            <div className="overflow-y-auto pr-2" style={{ maxHeight: '75vh' }}>
              <RecipeCard recipe={recipe} />
            </div>
          </motion.div>
        </div>
      )}


    </main>
  );
}
