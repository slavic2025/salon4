// src/lib/email-service.ts
'use server'

import { Resend } from 'resend'

import { createLogger } from './logger'

const logger = createLogger('EmailService')

// Inițializăm clientul Resend o singură dată
const resend = new Resend(process.env.RESEND_API_KEY)

// Definim un tip pentru o mai bună organizare
type EmailOptions = {
  to: string | string[]
  subject: string
  html: string
  from?: string // Opțional, putem seta un default
}

/**
 * O funcție reutilizabilă pentru a trimite email-uri folosind Resend.
 * @param options - Obiectul cu detaliile email-ului.
 */
export async function sendEmail(options: EmailOptions) {
  const fromAddress = options.from || 'Numele Salonului <onboarding@resend.dev>' // Schimbă cu domeniul tău verificat în Resend

  try {
    logger.info('Attempting to send email', { to: options.to, subject: options.subject })

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: options.to,
      subject: options.subject,
      html: options.html,
      // Poți adăuga și o componentă React aici, dacă folosești react-email
      // react: EmailTemplate({ firstName: 'John' }),
    })

    if (error) {
      logger.error('Failed to send email via Resend', { error })
      return { success: false, error: 'Eroare la trimiterea email-ului.' }
    }

    logger.info('Email sent successfully', { messageId: data?.id })
    return { success: true, data }
  } catch (error) {
    logger.error('An unexpected error occurred in sendEmail', { error })
    return { success: false, error: 'A apărut o eroare neașteptată.' }
  }
}
