'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const PUZZLE_IMAGE = '/images/memory 6.jpeg'
const GRID_SIZE = 3
const VIEWBOX_SIZE = 300
const PIECE_SIZE = VIEWBOX_SIZE / GRID_SIZE
const TAB_SIZE = PIECE_SIZE * 0.25

// Heart path centered and scaled to fit 300x300
const HEART_PATH = "M150,280 C60,190 10,120 10,70 C10,20 60,5 100,40 L150,90 L200,40 C240,5 290,20 290,70 C290,120 240,190 150,280 Z"

interface PuzzlePiece {
    id: number
    row: number
    col: number
    correctX: number
    correctY: number
    currentX: number
    currentY: number
    isLocked: boolean
    rotation: number
    path: string
}

interface PuzzleSectionProps {
    onComplete: () => void
}

export default function PuzzleSection({ onComplete }: PuzzleSectionProps) {
    const [pieces, setPieces] = useState<PuzzlePiece[]>([])
    const [isComplete, setIsComplete] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Generate jigsaw tabs (explicit neighbor matching)
        const hTabs = Array(GRID_SIZE).fill(0).map(() =>
            Array(GRID_SIZE - 1).fill(0).map(() => Math.random() > 0.5 ? 1 : -1)
        )
        const vTabs = Array(GRID_SIZE - 1).fill(0).map(() =>
            Array(GRID_SIZE).fill(0).map(() => Math.random() > 0.5 ? 1 : -1)
        )

        const newPieces: PuzzlePiece[] = []

        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                const id = row * GRID_SIZE + col
                const x = col * PIECE_SIZE
                const y = row * PIECE_SIZE

                // Tab logic: 0=flat, 1=out, -1=in
                const top = row === 0 ? 0 : -vTabs[row - 1][col]
                const bottom = row === GRID_SIZE - 1 ? 0 : vTabs[row][col]
                const left = col === 0 ? 0 : -hTabs[row][col - 1]
                const right = col === GRID_SIZE - 1 ? 0 : hTabs[row][col]

                const path = generatePiecePath(PIECE_SIZE, PIECE_SIZE, top, right, bottom, left, TAB_SIZE)

                // Scatter pieces around their correct positions
                const scatterRange = 80
                const randomX = x + (Math.random() - 0.5) * scatterRange * 2
                const randomY = y + (Math.random() - 0.5) * scatterRange * 2

                newPieces.push({
                    id,
                    row,
                    col,
                    correctX: x,
                    correctY: y,
                    currentX: randomX,
                    currentY: randomY,
                    isLocked: false,
                    rotation: (Math.random() - 0.5) * 20,
                    path
                })
            }
        }
        setPieces(newPieces)
    }, [])

    useEffect(() => {
        if (pieces.length > 0 && pieces.every(p => p.isLocked)) {
            setIsComplete(true)
        }
    }, [pieces])

    const handleDragEnd = (id: number, offset: { x: number, y: number }) => {
        setPieces(prev => prev.map(p => {
            if (p.id !== id) return p

            const newX = p.currentX + offset.x
            const newY = p.currentY + offset.y

            const dist = Math.sqrt(Math.pow(newX - p.correctX, 2) + Math.pow(newY - p.correctY, 2))

            if (dist < 35) {
                return { ...p, currentX: p.correctX, currentY: p.correctY, isLocked: true, rotation: 0 }
            }
            return { ...p, currentX: newX, currentY: newY }
        }))
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f7f4] relative overflow-hidden px-4">


            <div className="relative mb-8 text-center animate-fadeInUp z-40">
                <h2 className="text-2xl font-serif text-[#2a2a2a]">
                    {isComplete ? "" : "Put the pieces back together..."}
                </h2>
            </div>

            <div ref={containerRef} className="relative w-[300px] h-[300px] mb-8" style={{ touchAction: 'none' }}>
                {!isComplete && (
                    <svg className="absolute inset-0 pointer-events-none opacity-20" viewBox="0 0 300 300">
                        <path d={HEART_PATH} fill="none" stroke="#e63946" strokeWidth="2" strokeDasharray="5,5" />
                    </svg>
                )}

                <AnimatePresence>
                    {pieces.map(piece => (
                        <PuzzlePieceComponent
                            key={piece.id}
                            piece={piece}
                            onDragEnd={handleDragEnd}
                            isComplete={isComplete}
                        />
                    ))}
                </AnimatePresence>

                {isComplete && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: [1, 1.05, 1], opacity: 1 }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
                        className="absolute inset-0 z-20 pointer-events-none"
                    >
                        <div className="relative w-full h-full drop-shadow-2xl">
                            <div style={{ clipPath: `path('${HEART_PATH}')` }} className="w-full h-full">
                                <Image src={PUZZLE_IMAGE} alt="Completed Heart" fill className="object-cover" priority />
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {isComplete && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center z-30 relative"
                >
                    <h2 className="text-3xl font-bold text-[#e63946] mb-6 font-serif drop-shadow-sm">
                        You&apos;ve already put my heart together ❤️
                    </h2>
                    <Button
                        onClick={onComplete}
                        size="lg"
                        className="bg-[#e63946] text-white hover:bg-[#d62839] rounded-full px-12 py-6 text-xl shadow-xl transition-transform hover:scale-105"
                    >
                        Continue
                    </Button>
                </motion.div>
            )}
        </div>
    )
}

function PuzzlePieceComponent({
    piece,
    onDragEnd,
    isComplete
}: {
    piece: PuzzlePiece
    onDragEnd: (id: number, offset: { x: number, y: number }) => void
    isComplete: boolean
}) {
    if (isComplete) return null

    const padding = TAB_SIZE + 5
    const vbW = PIECE_SIZE + 2 * padding
    const vbH = PIECE_SIZE + 2 * padding
    const vbX = -padding
    const vbY = -padding

    return (
        <motion.div
            drag={!piece.isLocked}
            dragMomentum={false}
            dragElastic={0.05}
            onDragEnd={(_, info) => onDragEnd(piece.id, info.offset)}
            initial={{ x: piece.currentX, y: piece.currentY, rotate: piece.rotation }}
            animate={{
                x: piece.currentX,
                y: piece.currentY,
                rotate: piece.isLocked ? 0 : piece.rotation,
                scale: piece.isLocked ? 1 : 1.05
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            whileDrag={{
                scale: 1.15,
                zIndex: 30,
                filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))"
            }}
            whileHover={!piece.isLocked ? {
                scale: 1.08,
                filter: "drop-shadow(0 5px 10px rgba(0,0,0,0.2))"
            } : {}}
            className="absolute top-0 left-0 touch-none"
            style={{
                width: `${PIECE_SIZE}px`,
                height: `${PIECE_SIZE}px`,
                zIndex: piece.isLocked ? 1 : 10,
                cursor: piece.isLocked ? 'default' : 'grab',
                filter: piece.isLocked ? "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" : "drop-shadow(0 4px 8px rgba(0,0,0,0.15))"
            }}
        >
            <svg
                width={vbW}
                height={vbH}
                viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
                className="overflow-visible"
                style={{ position: 'absolute', top: -padding, left: -padding }}
            >
                <defs>
                    {/* Piece shape clip */}
                    <clipPath id={`piece-${piece.id}`}>
                        <path d={piece.path} />
                    </clipPath>

                    {/* Heart shape clip (global coordinates, will be transformed) */}
                    <clipPath id={`heart-${piece.id}`}>
                        <path d={HEART_PATH} />
                    </clipPath>
                </defs>

                {/* 
          Rendering strategy:
          1. Outer <g>: Clip by piece shape
          2. Inner <g>: Transform to "global" coordinates (shift by -correctX, -correctY)
          3. <image>: Render full 300x300 image at (0,0) in global coords
          4. Apply heart clip to image
          
          This creates a "window" effect where the piece shows the correct slice
        */}
                <g clipPath={`url(#piece-${piece.id})`}>
                    <g transform={`translate(${-piece.correctX}, ${-piece.correctY})`}>
                        <image
                            href={PUZZLE_IMAGE}
                            x="0"
                            y="0"
                            width={VIEWBOX_SIZE}
                            height={VIEWBOX_SIZE}
                            preserveAspectRatio="xMidYMid slice"
                            clipPath={`url(#heart-${piece.id})`}
                        />
                    </g>
                </g>

                {/* Piece border for visual clarity */}
                <path
                    d={piece.path}
                    fill="none"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="1.5"
                />
                <path
                    d={piece.path}
                    fill="none"
                    stroke="rgba(0,0,0,0.15)"
                    strokeWidth="1"
                    transform="translate(1,1)"
                />
            </svg>
        </motion.div>
    )
}

function generatePiecePath(
    w: number,
    h: number,
    top: number,
    right: number,
    bottom: number,
    left: number,
    tabSize: number
): string {
    let d = `M 0 0`

    // Top edge
    if (top === 0) {
        d += ` L ${w} 0`
    } else {
        const tabW = tabSize
        const tabH = tabSize * top
        d += ` L ${w / 2 - tabW / 2} 0`
        d += ` Q ${w / 2 - tabW / 2} ${tabH / 2} ${w / 2} ${tabH}`
        d += ` Q ${w / 2 + tabW / 2} ${tabH / 2} ${w / 2 + tabW / 2} 0`
        d += ` L ${w} 0`
    }

    // Right edge
    if (right === 0) {
        d += ` L ${w} ${h}`
    } else {
        const tabW = tabSize * right
        const tabH = tabSize
        d += ` L ${w} ${h / 2 - tabH / 2}`
        d += ` Q ${w - tabW / 2} ${h / 2 - tabH / 2} ${w - tabW} ${h / 2}`
        d += ` Q ${w - tabW / 2} ${h / 2 + tabH / 2} ${w} ${h / 2 + tabH / 2}`
        d += ` L ${w} ${h}`
    }

    // Bottom edge
    if (bottom === 0) {
        d += ` L 0 ${h}`
    } else {
        const tabW = tabSize
        const tabH = tabSize * bottom
        d += ` L ${w / 2 + tabW / 2} ${h}`
        d += ` Q ${w / 2 + tabW / 2} ${h - tabH / 2} ${w / 2} ${h - tabH}`
        d += ` Q ${w / 2 - tabW / 2} ${h - tabH / 2} ${w / 2 - tabW / 2} ${h}`
        d += ` L 0 ${h}`
    }

    // Left edge
    if (left === 0) {
        d += ` L 0 0`
    } else {
        const tabW = tabSize * left
        const tabH = tabSize
        d += ` L 0 ${h / 2 + tabH / 2}`
        d += ` Q ${-tabW / 2} ${h / 2 + tabH / 2} ${-tabW} ${h / 2}`
        d += ` Q ${-tabW / 2} ${h / 2 - tabH / 2} 0 ${h / 2 - tabH / 2}`
        d += ` L 0 0`
    }

    d += ` Z`
    return d
}
