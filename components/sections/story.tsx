'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

interface StorySectionProps {
  onComplete: () => void
}

const STORY_LINES = [
  'I wasn\'t planning anything.',
  'Not really.',
  '',
  'Then you happened.',
  '',
  'Quietly.',
  'Naturally.',
  'Like it was always supposed to.',
  '',
  'Somewhere between conversations,',
  'your lame jokes,',
  'and moments that felt a little too comfortable…',
  '',
  'I realized something.',
]

export default function StorySection({ onComplete }: StorySectionProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<any>(null)

  useEffect(() => {
    // Detect mobile
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleTapContinue = useCallback(() => {
    setCurrentLineIndex((prev) => {
      let next = prev + 1
      // Skip empty strings
      while (next < STORY_LINES.length && STORY_LINES[next] === '') {
        next++
      }
      return next < STORY_LINES.length ? next : prev
    })
  }, [])

  useEffect(() => {
    // Desktop: scroll-based
    const handleScroll = (e: WheelEvent) => {
      // Prevent rapid fire
      if (scrollTimeoutRef.current) return

      // Sensitive to deliberate scroll down
      if (e.deltaY > 5) {
        handleTapContinue()

        // Debounce for 600ms to allow animation to complete
        scrollTimeoutRef.current = setTimeout(() => {
          scrollTimeoutRef.current = null
        }, 600)
      }
    }

    if (!isMobile) {
      window.addEventListener('wheel', handleScroll, { passive: true })
      return () => {
        window.removeEventListener('wheel', handleScroll)
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
        scrollTimeoutRef.current = null
      }
    }
  }, [isMobile, handleTapContinue])

  const handleGoOn = () => {
    onComplete()
  }

  const showButton = currentLineIndex === STORY_LINES.length - 1

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center px-4 cursor-pointer transition-colors duration-500 relative overflow-hidden"
      onClick={handleTapContinue}
      style={{ backgroundColor: '#f9f7f4' }}
    >
      {/* Background Image - z-0 to stay above background color but below content */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Image
          src="/images/intro.jpeg"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto text-center space-y-8 relative z-10">
        {/* Current line */}
        <div className="min-h-32 flex items-center justify-center pointer-events-none">
          {STORY_LINES[currentLineIndex] && (
            <p
              key={currentLineIndex}
              className="text-3xl md:text-5xl font-light leading-relaxed animate-fadeInUp"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: '#2a2a2a',
              }}
            >
              {STORY_LINES[currentLineIndex]}
            </p>
          )}
        </div>

        {/* Button or hint */}
        {showButton ? (
          <div className="animate-fadeInUp pt-8">
            <Button
              onClick={handleGoOn}
              size="lg"
              className="px-8 py-6 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: '#e63946',
                color: 'white',
              }}
            >
              Go on
            </Button>
          </div>
        ) : isMobile ? (
          <div className="text-sm" style={{ color: '#a8a8a8' }}>
            Tap to continue
          </div>
        ) : (
          <div className="flex justify-center pt-4 animate-bounce" style={{ color: '#a8a8a8' }}>
            <ChevronDown size={24} />
          </div>
        )}
      </div>
    </div>
  )
}
