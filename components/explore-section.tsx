"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { sampleRecipes } from "@/lib/sample-data"

export default function ExploreSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const recipesPerPage = 3
  const totalPages = Math.ceil(sampleRecipes.length / recipesPerPage)

  const nextPage = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const currentRecipes = sampleRecipes.slice(currentIndex * recipesPerPage, (currentIndex + 1) * recipesPerPage)

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-playfair text-2xl text-gray-100">Explore Creations</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevPage}
            className="border-white/10 bg-black/30 hover:bg-black/50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextPage}
            className="border-white/10 bg-black/30 hover:bg-black/50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentRecipes.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="backdrop-blur-md bg-black/30 rounded-xl p-4 border border-white/10 shadow-lg"
          >
            <h3 className="font-playfair text-xl mb-2 text-gray-100">{recipe.name}</h3>
            <div className="mb-3 flex flex-wrap gap-1">
              {recipe.ingredients.slice(0, 3).map((ingredient, i) => (
                <span key={i} className="text-sm bg-white/10 rounded-full px-2 py-1 text-gray-300">
                  {ingredient.emoji} {ingredient.name.split(" ")[0]}
                </span>
              ))}
              {recipe.ingredients.length > 3 && (
                <span className="text-sm bg-white/10 rounded-full px-2 py-1 text-gray-300">
                  +{recipe.ingredients.length - 3} more
                </span>
              )}
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 border border-white/10"
            >
              Cook This
            </Button>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
