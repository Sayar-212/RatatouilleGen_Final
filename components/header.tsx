"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const taglines = [
  "Born from saffron dreams...",
  "Where flavors dance in harmony...",
  "Culinary poetry in motion...",
  "Whispers from a chef's imagination...",
  "Taste the unexpected symphony...",
]

export default function Header({ recipeCount = 0 }: { recipeCount?: number }) {
  const [taglineIndex, setTaglineIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [typedText, setTypedText] = useState('')
  const [isDark, setIsDark] = useState(true)

  
  const stats = [
    { label: "Recipes Generated", value: recipeCount.toString(), icon: "🍽️" },
    { label: "Global Cuisines", value: "275+", icon: "🌍" },
    { label: "AI Novelty", value: "95%", icon: "✨" }
  ]

  useEffect(() => {
    setMounted(true)
    document.documentElement.classList.add('dark')
    
    const taglineInterval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length)
    }, 4000)

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Simple typewriter for METAGEN
    setTimeout(() => {
      let currentIndex = 0
      const targetText = 'METAGEN'
      const typeInterval = setInterval(() => {
        if (currentIndex <= targetText.length) {
          setTypedText(targetText.slice(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(typeInterval)
        }
      }, 150)
    }, 4000)

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      const x = (clientX / innerWidth - 0.5) * 2
      const y = (clientY / innerHeight - 0.5) * 2
      setMousePos({ x, y })
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      clearInterval(taglineInterval)
      clearInterval(timeInterval)
      if (typeof window !== 'undefined') {
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [])

  return (
    <header className="relative text-center py-8 overflow-hidden">
      {/* Floating Stats */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-start px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:flex flex-col items-center bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-white/30 dark:border-gray-700/30"
        >
          <span className="text-2xl mb-1">🔥</span>
          <span className="text-xs font-bold text-slate-700 dark:text-white">TRENDING</span>
          <span className="text-xs text-slate-600 dark:text-gray-300">AI Fusion</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/25 dark:bg-black/25 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg border border-white/30 dark:border-gray-700/30 flex flex-col items-center"
        >
          <div className="text-xs font-bold text-slate-700 dark:text-white mb-1">KITCHEN TIME</div>
          <div className="text-sm font-mono text-slate-800 dark:text-gray-200">
            {mounted ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center space-x-3"
        >
          <button
            onClick={() => {
              setIsDark(!isDark)
              document.documentElement.classList.toggle('dark')
            }}
            className="bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-white/30 dark:border-gray-700/30 hover:scale-105 transition-transform"
          >
            <span className="text-xl">{isDark ? '☀️' : '🌙'}</span>
          </button>
          <div className="hidden md:flex flex-col items-center bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-white/30 dark:border-gray-700/30">
            <span className="text-2xl mb-1">⭐</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">RATING</span>
            <span className="text-xs text-slate-600 dark:text-slate-400">4.9/5.0</span>
          </div>
        </motion.div>
      </div>

      {/* Main Header Content */}
      <motion.div 
        className="mt-16 md:mt-12"
      >
        <div className="flex justify-center relative">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400/30 to-purple-400/30 rounded-full blur-xl scale-150 animate-pulse"></div>
            <img
              src="/logo_Favicon.png"
              alt="Ratatouille Metagen Logo"
              className="relative mx-auto mb-6 w-32 h-32 object-contain rounded-full shadow-2xl ring-4 ring-white/50 transition-all duration-300 bg-white/20 backdrop-blur-sm"
            />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative mb-6"
        >
          <motion.h1 
            className="font-playfair text-5xl md:text-7xl lg:text-8xl font-black relative z-10"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Cinematic Title Sequence */}
            <div 
              className="flex flex-col items-center space-y-4 relative"
              style={{
                transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 6}px)`
              }}
            >
              {/* Cinematic Background Effects */}
              <motion.div 
                className="absolute inset-0 -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ duration: 2 }}
              >
                <div className="absolute inset-0 bg-gradient-radial from-amber-500/20 via-transparent to-purple-500/20 blur-3xl" />
              </motion.div>
              
              {/* Main Title - Ratatouille */}
              <motion.div className="relative">
                <motion.span 
                  className="font-serif text-6xl md:text-8xl lg:text-9xl font-light tracking-wide relative block"
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                >
                  {/* Dramatic shadow */}
                  <span className="absolute inset-0 text-black/20 transform translate-x-2 translate-y-2 blur-sm">
                    Ratatouille
                  </span>
                  
                  {/* Main text with cinematic glow */}
                  <span 
                    className="relative bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 bg-clip-text text-transparent"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #f59e0b, #ef4444, #8b5cf6)',
                      backgroundSize: '200% 200%',
                      animation: 'cinematic-glow 8s ease-in-out infinite',
                      filter: 'drop-shadow(0 0 15px rgba(245, 158, 11, 0.6))'
                    }}
                  >
                    Ratatouille
                  </span>
                </motion.span>
              </motion.div>
              
              {/* Dramatic Pause Line */}
              <motion.div 
                className="flex items-center space-x-6 my-4"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 1, delay: 2.5 }}
              >
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
                <motion.div 
                  className="text-amber-400 dark:text-amber-300 text-sm font-light tracking-widest uppercase"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  A New Era
                </motion.div>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
              </motion.div>
              
              {/* Second Word - Metagen with Typewriter Effect */}
              <motion.span 
                className="font-serif text-2xl md:text-4xl lg:text-5xl font-light tracking-[0.25em] uppercase relative"
                style={{ 
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontVariant: 'small-caps'
                }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
              >

                <span 
                  className="relative bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57)',
                    backgroundSize: '200% 200%',
                    animation: 'designer-flow 5s ease-in-out infinite',
                    letterSpacing: '0.2em'
                  }}
                >
                  {typedText}
                  <motion.span
                    className="inline-block w-0.5 h-8 bg-orange-500 ml-1"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </span>
              </motion.span>
              
              {/* Cinematic Particles */}
              <motion.div 
                className="absolute -top-8 -right-12"
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 8, repeat: Infinity }}
              >
                <span className="text-amber-400 text-2xl">✨</span>
              </motion.div>
              <motion.div 
                className="absolute -bottom-6 -left-12"
                animate={{
                  x: [0, 15, 0],
                  opacity: [0.2, 0.6, 0.2],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 6, repeat: Infinity, delay: 2 }}
              >
                <span className="text-purple-400 text-xl">🌟</span>
              </motion.div>
            </div>
            
            {/* Elegant decorative elements */}
            <motion.div 
              className="mt-4 flex items-center justify-center space-x-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <motion.div 
                className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                initial={{ width: 0 }}
                animate={{ width: '80px' }}
                transition={{ duration: 1.5, delay: 1.4 }}
              />
              <motion.div 
                className="w-1.5 h-1.5 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div 
                className="h-px bg-gradient-to-r from-transparent via-rose-400 to-transparent"
                initial={{ width: 0 }}
                animate={{ width: '80px' }}
                transition={{ duration: 1.5, delay: 1.4 }}
              />
            </motion.div>
            
            {/* Refined sparkle effects */}
            <motion.span 
              className="absolute -top-6 -right-8 text-xl opacity-60"
              animate={{ 
                rotate: [0, 360], 
                scale: [1, 1.2, 1],
                opacity: [0.6, 0.9, 0.6]
              }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              ✨
            </motion.span>
            <motion.span 
              className="absolute -bottom-4 -left-8 text-lg opacity-50"
              animate={{ 
                rotate: [0, -180, -360], 
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            >
              🌟
            </motion.span>
          </motion.h1>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-xl text-slate-600 dark:text-white mb-6 font-medium"
        >
          Novel Recipes. Secret AI Chef. Endless Surprise.✨
        </motion.p>

        {/* Animated Tagline */}
        <div className="h-8 mb-8">
          <motion.p
            key={taglineIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="text-sm text-slate-500 dark:text-gray-300 italic font-light"
          >
            {taglines[taglineIndex]}
          </motion.p>
        </div>

        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="bg-white/30 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/40 hover:bg-white/40 transition-all duration-300"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-lg font-bold text-slate-800 dark:text-white">{stat.value}</div>
              <div className="text-xs text-slate-600 dark:text-gray-300 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      
      <style jsx>{`
        @keyframes cinematic-glow {
          0% { background-position: 0% 50%; filter: drop-shadow(0 0 15px rgba(245, 158, 11, 0.6)); }
          33% { background-position: 100% 50%; filter: drop-shadow(0 0 20px rgba(239, 68, 68, 0.7)); }
          66% { background-position: 50% 100%; filter: drop-shadow(0 0 18px rgba(139, 92, 246, 0.6)); }
          100% { background-position: 0% 50%; filter: drop-shadow(0 0 15px rgba(245, 158, 11, 0.6)); }
        }
        @keyframes designer-flow {
          0% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </header>
  )
}
