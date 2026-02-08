'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface IntroSectionProps {
  onStart: () => void
}

export default function IntroSection({ onStart }: IntroSectionProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden" style={{ backgroundColor: '#f9f7f4' }}>
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/images/intro.jpeg"
            alt=""
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute top-20 right-20 w-48 h-48 rounded-full opacity-5" style={{ backgroundColor: '#e63946' }} />
        <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full opacity-5" style={{ backgroundColor: '#f4a5b9' }} />
      </div>

      <div className="max-w-2xl mx-auto text-center space-y-12 relative z-10">
        {/* Main text */}
        <div className={`space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h1
            className="text-5xl md:text-6xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-playfair)', color: '#2a2a2a' }}
          >
            Hey you.
          </h1>

          <div className="space-y-4 text-lg md:text-xl leading-relaxed" style={{ color: '#5a5a5a' }}>
            <p>I made something small.</p>
            <p>You only need your curiosity❤️</p>
            <p className="pt-4">Catch a few moments...<br />if you can ;)</p>
          </div>
        </div>

        {/* Button */}
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Button
            onClick={onStart}
            size="lg"
            className="px-8 py-6 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: '#e63946',
              color: 'white',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(230, 57, 70, 0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Start
          </Button>
        </div>
      </div>
    </div>
  )
}
