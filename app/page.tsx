'use client'

import { useState } from 'react'

// Sections
import IntroSection from '@/components/sections/intro'
import GameSection from '@/components/sections/game'
import StorySection from '@/components/sections/story'
import PuzzleSection from '@/components/sections/puzzle'
import AskSection from '@/components/sections/ask'

export default function Home() {
  const [currentSection, setCurrentSection] = useState<'intro' | 'game' | 'story' | 'puzzle' | 'ask'>('intro')

  const handleStartGame = () => {
    setCurrentSection('game')
  }

  const handleGameComplete = () => {
    setCurrentSection('story')
  }

  const handleStoryComplete = () => {
    setCurrentSection('puzzle')
  }

  const handlePuzzleComplete = () => {
    setCurrentSection('ask')
  }

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ backgroundColor: '#f9f7f4' }}>
      {currentSection === 'intro' && (
        <IntroSection onStart={handleStartGame} />
      )}

      {currentSection === 'game' && (
        <GameSection onComplete={handleGameComplete} />
      )}

      {currentSection === 'story' && (
        <StorySection onComplete={handleStoryComplete} />
      )}

      {currentSection === 'puzzle' && (
        <PuzzleSection onComplete={handlePuzzleComplete} />
      )}

      {currentSection === 'ask' && (
        <AskSection />
      )}
    </main>
  )
}
