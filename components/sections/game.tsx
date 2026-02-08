'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

const HEART_IMAGES = [
  '/images/heart 1.png',
  '/images/heart 2.png',
  '/images/heart 3.png',
  '/images/heart 4.png',
  '/images/heart 5.png',
]

const MEMORY_IMAGES = [
  '/images/memory 1.jpeg',
  '/images/memory 2.jpeg',
  '/images/memory 3.jpeg',
  '/images/memory 4.jpeg',
  '/images/memory 5.jpeg',
]

interface Heart {
  id: number
  left: number
  delay: number
  message: string
  index: number
  imageSrc: string
}

interface GameSectionProps {
  onComplete: () => void
}

const MEMORIES = [
  'That first sunset, just you and me',
  'The way you smile when you don\'t even realize you\'re doing it.',
  'That moment I thought: oh… this is different.',
  'Every time you made an ordinary day better.',
  'Somehow, without trying, you became my favorite part.',
]

export default function GameSection({ onComplete }: GameSectionProps) {
  const [hearts, setHearts] = useState<Heart[]>([])
  const [caught, setCaught] = useState<number[]>([])
  const [selectedMemory, setSelectedMemory] = useState<{ message: string, imageSrc: string } | null>(null)
  const [showCompletion, setShowCompletion] = useState(false)
  const [gameFailed, setGameFailed] = useState(false)
  const [missedHearts, setMissedHearts] = useState<number[]>([])
  const heartIdRef = useRef(0)
  const gameContainerRef = useRef<HTMLDivElement>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // Pause and Timing State
  const isPaused = selectedMemory !== null
  const [startTime, setStartTime] = useState<number | null>(null)
  const [totalPausedTime, setTotalPausedTime] = useState(0)
  const pauseStartTimeRef = useRef<number | null>(null)

  useEffect(() => {
    setIsHydrated(true)
    setStartTime(Date.now())
  }, [])

  // Handle Pause Timing
  useEffect(() => {
    if (isPaused) {
      pauseStartTimeRef.current = Date.now()
    } else {
      if (pauseStartTimeRef.current) {
        const pausedDuration = Date.now() - pauseStartTimeRef.current
        setTotalPausedTime((prev) => prev + pausedDuration)
        pauseStartTimeRef.current = null
      }
    }
  }, [isPaused])

  useEffect(() => {
    // Generate hearts with staggered delays
    const newHearts = MEMORIES.map((message, index) => ({
      id: heartIdRef.current++,
      left: Math.random() * 80 + 10,
      delay: index * 1.2,
      message,
      index,
      imageSrc: HEART_IMAGES[index % HEART_IMAGES.length],
    }))
    setHearts(newHearts)
  }, [])

  // Check for missed hearts (Polling Loop)
  useEffect(() => {
    if (!startTime || isPaused) return

    const interval = setInterval(() => {
      const now = Date.now()
      const effectiveTime = now - startTime - totalPausedTime

      hearts.forEach((heart) => {
        if (!caught.includes(heart.id) && !missedHearts.includes(heart.id)) {
          // Each heart falls for 4 seconds
          const fallDuration = 4000
          const targetTime = (heart.delay * 1000) + fallDuration - 500

          if (effectiveTime > targetTime) {
            setMissedHearts((prev) => {
              if (prev.includes(heart.id)) return prev

              const newMissed = [...prev, heart.id]
              if (newMissed.length >= 2) {
                setGameFailed(true)
              }
              return newMissed
            })
          }
        }
      })
    }, 100)

    return () => clearInterval(interval)
  }, [hearts, caught, missedHearts, isPaused, startTime, totalPausedTime])

  // Check for completion (success or failure handled by render)
  useEffect(() => {
    if (caught.length + missedHearts.length === MEMORIES.length) {
      if (!gameFailed && missedHearts.length < 2 && !selectedMemory) {
        // Only show completion if no memory modal is open
        const timer = setTimeout(() => {
          setShowCompletion(true)
        }, 300) // Small delay for immediate snap-in after closing modal
        return () => clearTimeout(timer)
      }
    }
  }, [caught.length, missedHearts.length, gameFailed, selectedMemory])

  const handleHeartClick = (id: number, message: string, index: number) => {
    if (!caught.includes(id)) {
      setCaught([...caught, id])
      setSelectedMemory({
        message,
        imageSrc: MEMORY_IMAGES[index % MEMORY_IMAGES.length]
      })
    }
  }

  const handleContinue = () => {
    onComplete()
  }

  const handleReset = () => {
    // Reset state and regenerate hearts
    heartIdRef.current = 0
    const newHearts = MEMORIES.map((message, index) => ({
      id: heartIdRef.current++,
      left: Math.random() * 80 + 10,
      delay: index * 1.2,
      message,
      index,
      imageSrc: HEART_IMAGES[index % HEART_IMAGES.length],
    }))
    setHearts(newHearts)
    setCaught([])
    setMissedHearts([])
    setGameFailed(false)
    setSelectedMemory(null)
    setShowCompletion(false)

    // Reset Timing
    setStartTime(Date.now())
    setTotalPausedTime(0)
    pauseStartTimeRef.current = null
  }

  if (gameFailed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 overflow-hidden" style={{ backgroundColor: '#f9f7f4' }}>
        <div className="max-w-2xl mx-auto text-center space-y-8 animate-fadeInUp">
          <h2 className="text-5xl md:text-6xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: '#2a2a2a' }}>
            Oh no...
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed" style={{ color: '#5a5a5a' }}>
            You missed some precious moments.
          </p>
          <p className="text-lg" style={{ color: '#a8a8a8' }}>
            Caught: {caught.length} / {MEMORIES.length}
          </p>

          <Button
            onClick={handleReset}
            size="lg"
            className="px-8 py-6 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: '#e63946',
              color: 'white',
            }}
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (showCompletion) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 overflow-hidden" style={{ backgroundColor: '#f9f7f4' }}>
        <div className="max-w-2xl mx-auto text-center space-y-8 animate-fadeInUp">
          <h2 className="text-5xl md:text-6xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: '#2a2a2a' }}>
            Okay.
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed" style={{ color: '#5a5a5a' }}>
            That&apos;s enough moments for now.
          </p>

          <Button
            onClick={handleContinue}
            size="lg"
            className="px-8 py-6 text-lg font-medium rounded-full transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: '#e63946',
              color: 'white',
            }}
          >
            Why are you showing me this?
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div ref={gameContainerRef} className="relative min-h-screen overflow-hidden" style={{ backgroundColor: '#f9f7f4' }}>
      {/* Game container */}
      <div className="relative h-screen">
        {/* Progress indicator */}
        <div className="absolute top-6 right-6 text-sm font-medium" style={{ color: '#a8a8a8' }}>
          {caught.length} / {MEMORIES.length}
        </div>

        {/* Hint text */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-sm" style={{ color: '#a8a8a8' }}>
          Click the falling hearts ❤️
        </div>

        {/* Falling hearts */}
        {hearts.map((heart) => (
          <FallingHeart
            key={heart.id}
            heart={heart}
            isCaught={caught.includes(heart.id)}
            isPaused={isPaused}
            onClick={() => handleHeartClick(heart.id, heart.message, heart.index)}
          />
        ))}
      </div>

      {/* Memory modal */}
      {selectedMemory && (
        <MemoryModal
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
        />
      )}
    </div>
  )
}

interface FallingHeartProps {
  heart: Heart
  isCaught: boolean
  isPaused: boolean
  onClick: () => void
}

function FallingHeart({ heart, isCaught, isPaused, onClick }: FallingHeartProps) {
  if (isCaught) return null

  return (
    <div
      className={`absolute cursor-pointer select-none transition-transform duration-300 hover:scale-150`}
      style={{
        left: `${heart.left}%`,
        top: '-120px',
        opacity: 0, // Start invisible, keyframe will handle opacity
        animation: `heartFall 4s linear forwards`,
        animationDelay: `${heart.delay}s`,
        animationPlayState: isPaused ? 'paused' : 'running',
        fontSize: '72px',
      }}
      onClick={onClick}
    >
      <div className="relative w-16 h-16 md:w-24 md:h-24">
        <Image
          src={heart.imageSrc}
          alt="Heart"
          fill
          className="object-contain drop-shadow-lg"
          priority
        />
      </div>
    </div>
  )
}

interface MemoryModalProps {
  memory: { message: string, imageSrc: string }
  onClose: () => void
}

function MemoryModal({ memory, onClose }: MemoryModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-fadeInUp relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: '#ffffff' }}
      >
        <div className="flex justify-end mb-2">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-6">
          {/* Memory Image */}
          <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-md">
            <Image
              src={memory.imageSrc}
              alt="Memory"
              fill
              className="object-cover"
              priority
            />
          </div>

          <p className="text-center text-xl font-medium leading-relaxed" style={{ color: '#2a2a2a', fontFamily: 'var(--font-playfair)' }}>
            {memory.message}
          </p>

          <div className="flex justify-center">
            <span className="text-3xl animate-float">❤️</span>
          </div>
        </div>
      </div>
    </div>
  )
}
