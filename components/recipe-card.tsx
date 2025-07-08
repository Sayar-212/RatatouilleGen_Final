"use client";

import { motion } from "framer-motion";
import type { Recipe } from "@/lib/types";
import { Clock, ChefHat } from "lucide-react";

interface RecipeCardProps {
  recipe: Recipe;
}

import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const capitalize = (str: string) => str.length ? str[0].toUpperCase() + str.slice(1) : str;
  const clean = (str: string) => capitalize(str.trim().replace(/\s+/g, ' '));
  const handleDownloadPDF = () => {
    const name = clean(recipe.name);
    const taste = clean(recipe.taste);
    const regionalContext = clean(recipe.regionalContext);
    const servingSuggestion = clean(recipe.servingSuggestion);
    const ingredients = recipe.ingredients.map(i => ({ ...i, name: clean(i.name) }));
    const steps = recipe.steps
      .map(s => clean(s))
      .filter(s => s && s.replace(/^\d+\.\s*/, '').trim());

    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 50;
    const contentWidth = pageWidth - 2 * margin;
    
    // Color palette
    const colors = {
      primary: [168, 144, 254],    // Purple
      secondary: [255, 128, 181],  // Pink
      accent: [255, 215, 0],       // Gold
      dark: [35, 35, 78],          // Dark blue
      text: [45, 45, 45],          // Dark gray
      lightText: [100, 100, 100],  // Light gray
      white: [255, 255, 255]
    };

    // Helper functions
    const addGradientBackground = () => {
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Add watermark
      pdf.saveGraphicsState();
      pdf.setGState(pdf.GState({ opacity: 0.25 }));
      pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.setFont("times", "normal");
      pdf.setFontSize(36);
      
      const watermarkText = "Ratatouille_Metagen";
      const textWidth = pdf.getTextWidth(watermarkText);
      const x = (pageWidth - textWidth) / 2;
      const y = pageHeight / 2;
      
      pdf.text(watermarkText, x, y, { angle: 45 });
      pdf.restoreGraphicsState();
    };



    fetch('/Logo_favicon.png')
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = function () {
          const logoDataUrl = reader.result as string;
          let yOffset = 60;
          
          addGradientBackground();
          
          // Header section with logo
          const logoWidth = 140;
          const logoHeight = 56;
          const logoX = (pageWidth - logoWidth) / 2;
          pdf.addImage(logoDataUrl, 'PNG', logoX, yOffset, logoWidth, logoHeight);
          yOffset += logoHeight + 30;

          // Main title with elegant styling
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(28);
          pdf.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
          const titleLines = pdf.splitTextToSize(name, contentWidth - 40);
          const titleY = yOffset;
          titleLines.forEach((line: string, index: number) => {
            const lineWidth = pdf.getTextWidth(line);
            const lineX = (pageWidth - lineWidth) / 2;
            pdf.text(line, lineX, titleY + (index * 35));
          });
          yOffset += titleLines.length * 35 + 20;

          // Decorative line under title
          const lineY = yOffset;
          pdf.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
          pdf.setLineWidth(3);
          const lineWidth = 200;
          const lineX = (pageWidth - lineWidth) / 2;
          pdf.line(lineX, lineY, lineX + lineWidth, lineY);
          yOffset += 40;

          // Taste section
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(16);
          pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
          pdf.text("TASTE PROFILE", margin, yOffset);
          yOffset += 20;
          
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(12);
          pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
          const tasteLines = pdf.splitTextToSize(taste, contentWidth);
          pdf.text(tasteLines, margin, yOffset);
          yOffset += tasteLines.length * 15 + 20;

          // Regional Context section
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(16);
          pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
          pdf.text("REGIONAL HERITAGE", margin, yOffset);
          yOffset += 20;
          
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(12);
          pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
          const contextLines = pdf.splitTextToSize(regionalContext, contentWidth);
          pdf.text(contextLines, margin, yOffset);
          yOffset += contextLines.length * 15 + 25;

          // Ingredients section
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(16);
          pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
          pdf.text("INGREDIENTS", margin, yOffset);
          yOffset += 20;
          
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(12);
          ingredients.forEach((ingredient, index) => {
            if (yOffset > pageHeight - 100) {
              pdf.addPage();
              addGradientBackground();
              yOffset = 60;
            }
            
            pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
            pdf.text("•", margin, yOffset);
            
            pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
            const ingLines = pdf.splitTextToSize(ingredient.name, contentWidth - 20);
            pdf.text(ingLines, margin + 15, yOffset);
            yOffset += ingLines.length * 15 + 3;
          });
          yOffset += 20;

          // Instructions section
          if (yOffset > pageHeight - 150) {
            pdf.addPage();
            addGradientBackground();
            yOffset = 60;
          }
          
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(16);
          pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
          pdf.text("COOKING INSTRUCTIONS", margin, yOffset);
          yOffset += 20;
          
          steps.forEach((step, index) => {
            if (yOffset > pageHeight - 100) {
              pdf.addPage();
              addGradientBackground();
              yOffset = 60;
            }
            
            const cleanStep = step.replace(/^\d+\.\s*/, '').trim();
            
            pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(12);
            const stepNum = `${index + 1}.`;
            pdf.text(stepNum, margin, yOffset);
            
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(12);
            pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
            const stepLines = pdf.splitTextToSize(cleanStep, contentWidth - 25);
            pdf.text(stepLines, margin + 20, yOffset);
            yOffset += stepLines.length * 15 + 5;
          });
          yOffset += 20;

          // Serving suggestion section
          if (yOffset > pageHeight - 120) {
            pdf.addPage();
            addGradientBackground();
            yOffset = 60;
          }
          
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(16);
          pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
          pdf.text("SERVING SUGGESTION", margin, yOffset);
          yOffset += 20;
          
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(12);
          pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
          const suggestionLines = pdf.splitTextToSize(servingSuggestion, contentWidth);
          pdf.text(suggestionLines, margin, yOffset);
          yOffset += suggestionLines.length * 15 + 30;

          // Footer
          if (yOffset > pageHeight - 60) {
            pdf.addPage();
            addGradientBackground();
            yOffset = pageHeight - 60;
          } else {
            yOffset = Math.max(yOffset, pageHeight - 60);
          }
          
          pdf.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
          pdf.setLineWidth(1);
          pdf.line(margin, yOffset - 15, pageWidth - margin, yOffset - 15);
          
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(12);
          pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
          const signature = "Created with Ratatouille Metagen";
          const sigWidth = pdf.getTextWidth(signature);
          pdf.text(signature, (pageWidth - sigWidth) / 2, yOffset);
          
          pdf.save(`${name.replace(/[^a-zA-Z0-9]/g, "_")}_Recipe.pdf`);
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => {
        addGradientBackground();
        let yOffset = 60;
        
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(20);
        pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        pdf.text("Ratatouille Metagen", pageWidth/2, yOffset, { align: "center" });
        
        pdf.save(`${name.replace(/[^a-zA-Z0-9]/g, "_")}_Recipe.pdf`);
      });
  };

  return (
    <motion.div ref={cardRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="backdrop-blur-xl bg-gradient-to-br from-[#23234e]/80 via-[#2b1930]/80 to-[#ff80b5]/20 rounded-3xl p-10 border border-white/10 shadow-2xl h-full relative"
      style={{ boxShadow: '0 0 40px 4px #ff80b5, 0 0 12px 1px #a890fe' }}
    >
      <button
        onClick={handleDownloadPDF}
        className="absolute top-4 right-4 z-20 px-3 py-2 rounded-lg bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-400 text-white font-bold shadow-lg hover:scale-105 transition-transform border-2 border-white/20 text-lg"
        title="Download PDF"
      >
        ↓
      </button>
      <h2 className="font-playfair text-4xl md:text-5xl text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-fuchsia-400 to-indigo-400 drop-shadow-glow animate-text-shimmer">
        {recipe.name}
      </h2>

      <div className="mb-6">
        <h3 className="text-xl font-playfair mb-1 text-gray-100">Taste</h3>
        <p className="text-gray-300 italic mb-4">{recipe.taste}</p>

        <h3 className="text-xl font-playfair mb-1 text-gray-100">
          Regional Context
        </h3>
        <p className="text-gray-300">{recipe.regionalContext}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-playfair mb-3 text-gray-100">
          Ingredients
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {recipe.ingredients.map((ingredient, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center text-gray-300"
            >
              <span className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mr-3 flex-shrink-0 mt-1"></span>
              <span>{ingredient.name}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-playfair mb-3 text-gray-100">
          Instructions
        </h3>
        <ol className="space-y-4">
          {recipe.steps
            .filter(step => step && step.replace(/^\d+\.\s*/, '').trim())
            .map((step, index) => {
              const cleanStep = step.replace(/^\d+\.\s*/, '').trim();
              return (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="text-gray-300"
                >
                  <div className="flex">
                    <span className="font-playfair text-amber-300 mr-3">
                      {index + 1}.
                    </span>
                    <span>{cleanStep}</span>
                  </div>
                </motion.li>
              );
            })}
        </ol>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <h3 className="text-lg font-playfair mb-2 text-gray-100">
          Serving Suggestion
        </h3>
        <p className="text-gray-300 italic">{recipe.servingSuggestion}</p>
      </div>
      <div className="mt-10 pt-6 border-t border-white/10 text-center">
        <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-400 animate-text-shimmer tracking-widest drop-shadow-glow">
          Created by <span className="font-extrabold">Ratatouille_Metagen</span> TM
        </span>
      </div>
    </motion.div>
  );
}
