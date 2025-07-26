'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export function AnimatedSection({ children, className = '', delay = 0, direction = 'up' }: AnimatedSectionProps) {
  const directionVariants = {
    up: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } },
    down: { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={directionVariants[direction]}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedContainer({
  children,
  className = '',
  staggerChildren = 0.1,
}: {
  children: ReactNode
  className?: string
  staggerChildren?: number
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
      },
    },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedItem({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div variants={variants} transition={{ delay }} className={className}>
      {children}
    </motion.div>
  )
}

export function AnimatedCard({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
