import { type ClassValue, clsx } from 'clsx'
import { LucideIcon } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

import { IconName, Icons } from '@/components/shared/icons'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * A type-safe helper function to get an icon component by name.
 * * @param name The name of the icon to retrieve.
 * @returns The corresponding LucideIcon component, or a fallback icon if not found.
 */
export function getIconComponent(name?: string): LucideIcon {
  // First, check if the name is a valid IconName.
  // This function acts as a type guard.
  const isIconName = (key?: string): key is IconName => {
    return !!key && key in Icons
  }

  // If the name is valid, return the corresponding icon.
  if (isIconName(name)) {
    return Icons[name]
  }

  // Otherwise, return a default fallback icon.
  return Icons.arrowRight
}
