'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export default function AskSection() {
  const [hasAnswered, setHasAnswered] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)
  const [showBonus, setShowBonus] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const noButtonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleYes = () => {
    setHasAnswered(true)
  }

  const handleNo = () => {
    if (attemptCount === 0) {
      // First click: show modal
      setShowModal(true)
      setAttemptCount(1)
      return
    }

    setAttemptCount((prev) => prev + 1)

    if (attemptCount >= 2) {
      // After 3 total attempts, show the "Nice try" message
      return
    }

    // Move the button away
    if (noButtonRef.current) {
      const randomX = (Math.random() - 0.5) * 200
      const randomY = (Math.random() - 0.5) * 200
      noButtonRef.current.style.transform = `translate(${randomX}px, ${randomY}px)`
    }
  }

  const handleContainerClick = () => {
    if (showBonus) {
      setShowBonus(false)
    } else if (hasAnswered) {
      setShowBonus(true)
    }
  }

  if (showBonus) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 overflow-hidden cursor-pointer"
        onClick={handleContainerClick}
        style={{ backgroundColor: '#f9f7f4' }}
      >
        <div className="max-w-2xl mx-auto text-center space-y-6 animate-fadeInUp">
          <p className="text-2xl md:text-3xl leading-relaxed" style={{ color: '#2a2a2a' }}>
            By the way..
          </p>
          <p className="text-3xl md:text-4xl font-light" style={{ fontFamily: 'var(--font-playfair)', color: '#2a2a2a' }}>
            you&apos;re my favorite decision.
          </p>
          <p className="text-xl md:text-2xl pt-4 italic animate-pulse" style={{ color: '#e63946' }}>
            mwahhh
          </p>
        </div>
      </div>
    )
  }

  if (hasAnswered) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 overflow-hidden cursor-pointer transition-all duration-1000"
        onClick={handleContainerClick}
        style={{
          backgroundColor: '#faf8f6',
        }}
      >
        <div className="max-w-2xl mx-auto text-center space-y-8 animate-fadeInUp">
          {/* Floating hearts */}
          <Confetti />

          <div className="space-y-6">
            <p className="text-5xl md:text-6xl" style={{ color: '#e63946' }}>
              ❤️
            </p>
            <h2
              className="text-5xl md:text-6xl font-bold"
              style={{ fontFamily: 'var(--font-playfair)', color: '#2a2a2a' }}
            >
              Like there was ever another way.
            </h2>

            <div className="space-y-3 pt-6">
              <p className="text-2xl md:text-3xl" style={{ color: '#5a5a5a' }}>
                So…
              </p>
              <p className="text-xl md:text-2xl font-light" style={{ color: '#5a5a5a' }}>
                Dinner&apos;s on me ❤️
              </p>
              <p className="text-lg" style={{ color: '#5a5a5a' }}>
                Valentine&apos;s Day ... just you and me.
              </p>
            </div>

            <p className="text-xs pt-4" style={{ color: '#a8a8a8' }}>
              Click anywhere to continue
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center px-4 overflow-hidden"
        style={{ backgroundColor: '#f9f7f4' }}
        ref={containerRef}
      >
        <div className="max-w-2xl mx-auto text-center space-y-12">
          <h1
            className="text-5xl md:text-6xl font-bold"
            style={{ fontFamily: 'var(--font-playfair)', color: '#2a2a2a' }}
          >
            Will you be my Valentine?
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative min-h-16">
            {/* Yes button */}
            <Button
              onClick={handleYes}
              size="lg"
              className="px-10 py-6 text-lg font-medium rounded-full transition-all duration-300 hover:scale-110 relative z-10"
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
              💗 Yes
            </Button>

            {/* No button */}
            <button
              ref={noButtonRef}
              onClick={handleNo}
              className="px-10 py-6 text-lg font-medium rounded-full transition-all duration-500 relative"
              style={{
                backgroundColor: 'transparent',
                color: '#5a5a5a',
                border: '2px solid #d0d0d0',
              }}
              onMouseEnter={(e) => {
                if (attemptCount < 3) {
                  const randomX = (Math.random() - 0.5) * 200
                  const randomY = (Math.random() - 0.5) * 200
                  e.currentTarget.style.transform = `translate(${randomX}px, ${randomY}px)`
                }
              }}
            >
              {attemptCount >= 3 ? '😌 Nice try' : '😌 Let me think'}
            </button>
          </div>

          <p className="text-sm" style={{ color: '#a8a8a8' }}>
            {attemptCount >= 3 && '😌'}
          </p>
        </div>
      </div>

      <PlayfulModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}

function PlayfulModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [showCaption, setShowCaption] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowCaption(false)
      // Show caption after image animation completes (1200ms)
      const timer = setTimeout(() => setShowCaption(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors z-10"
              aria-label="Close"
            >
              <X size={32} />
            </button>

            {/* Image with rotate + fade animation */}
            <motion.div
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              transition={{
                duration: 1.2,
                ease: [0.34, 1.56, 0.64, 1],
                rotate: {
                  duration: 1.2,
                  ease: "easeOut"
                }
              }}
              className="relative w-full aspect-square max-w-md mx-auto mb-6"
            >
              <Image
                src="/images/useless.jpeg"
                alt="Playful response"
                fill
                className="object-contain rounded-2xl"
                priority
              />
            </motion.div>

            {/* Caption fade-in */}
            <AnimatePresence>
              {showCaption && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-center text-2xl md:text-3xl font-medium text-white"
                >
                  Better luck next time 😏
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Confetti() {
  const [confetti, setConfetti] = useState<Array<{
    id: number;
    left: number;
    delay: number;
    duration: number;
    emoji: string;
  }>>([])

  useEffect(() => {
    const emojis = ['❤️', '💕', '✨', '💗']
    const items = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 1.5,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }))
    setConfetti(items)
  }, [])

  return (
    <>
      {confetti.map((item) => (
        <div
          key={item.id}
          className="fixed pointer-events-none text-2xl md:text-4xl"
          style={{
            left: `${item.left}%`,
            top: '-40px',
            animationName: 'confetti-fall',
            animationDuration: `${item.duration}s`,
            animationTimingFunction: 'ease-in',
            animationFillMode: 'forwards',
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.emoji}
        </div>
      ))}
    </>
  )
}
