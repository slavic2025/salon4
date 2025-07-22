import { Crown, Eye, Flower, Gift, Heart, Moon, Paintbrush, Scissors, Sparkles, Star, Zap } from 'lucide-react'

// Maparea tipurilor de servicii la iconuri
export const getServiceIcon = (serviceName: string) => {
  const name = serviceName.toLowerCase()

  // Tuns/Coafură
  if (name.includes('tuns') || name.includes('coafat') || name.includes('coafura') || name.includes('styling')) {
    return <Scissors />
  }

  // Vopsit/Culoare
  if (
    name.includes('vopsit') ||
    name.includes('culoare') ||
    name.includes('reflex') ||
    name.includes('balayage') ||
    name.includes('suvite')
  ) {
    return <Paintbrush />
  }

  // Tratamente păr
  if (name.includes('tratament') || name.includes('masca') || name.includes('hidratare') || name.includes('keratina')) {
    return <Sparkles />
  }

  // Manichiură/Unghii
  if (name.includes('manichiura') || name.includes('unghii') || name.includes('gel') || name.includes('french')) {
    return <Star />
  }

  // Pedichiură
  if (name.includes('pedichiura') || name.includes('picioare')) {
    return <Heart />
  }

  // Make-up/Machiaj
  if (name.includes('machiaj') || name.includes('makeup') || name.includes('make-up')) {
    return <Eye />
  }

  // Epilare/Depilare
  if (name.includes('epilare') || name.includes('depilare') || name.includes('ceara')) {
    return <Zap />
  }

  // Masaj/Relaxare
  if (name.includes('masaj') || name.includes('relaxare') || name.includes('spa')) {
    return <Flower />
  }

  // Extensii/Prelungiri
  if (name.includes('extensii') || name.includes('prelungire') || name.includes('gene')) {
    return <Crown />
  }

  // Tratamente faciale
  if (name.includes('facial') || name.includes('curatare') || name.includes('peeling')) {
    return <Moon />
  }

  // Default pentru servicii neidentificate
  return <Gift />
}

// Lista de iconuri disponibile pentru preview/configurare
export const availableServiceIcons = {
  scissors: <Scissors />,
  paintbrush: <Paintbrush />,
  sparkles: <Sparkles />,
  star: <Star />,
  heart: <Heart />,
  eye: <Eye />,
  zap: <Zap />,
  flower: <Flower />,
  crown: <Crown />,
  moon: <Moon />,
  gift: <Gift />,
}
