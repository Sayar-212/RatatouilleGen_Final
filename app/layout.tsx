import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Ratatouille_Metagen | AI Chef | New Era in Novel Recipe Generator |",
  description: "AI-powered recipe generator using Meta Llama LLM for creating novel, authentic regional recipes from your ingredients",
  generator: 'v0.dev',
  icons: {
    icon: '/logo_Favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/logo_Favicon.png" />
      </head>
      <body suppressHydrationWarning={true} className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">
              {children}
            </main>
            <footer className="w-full py-4 flex justify-center items-center text-xs text-muted-foreground bg-background/80 border-t border-border whitespace-nowrap overflow-x-auto" style={{minHeight:'2.5rem'}}>
              <span className="text-blue-400 mr-2">⚡</span><a href="https://cosylab.iiitd.edu.in/" target="_blank" rel="noopener noreferrer" className="font-semibold text-yellow-400 dark:text-amber-200 mx-1 hover:underline">CoSy Lab, IIIT-Delhi</a> | Under the supervision of <span className="font-semibold text-rose-400 dark:text-rose-200 mx-1">Dr. Ganesh Bagler</span><span className="text-purple-400 ml-2">🚀</span>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
