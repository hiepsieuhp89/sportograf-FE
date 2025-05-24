import emailjs from '@emailjs/browser'

// Initialize EmailJS with your public key
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || ''
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || ''

export interface EmailParams {
  to_email: string
  to_name: string
  event_title: string
  event_date: string
  event_location: string
  event_description: string
  confirmation_link: string
  note_to_photographer?: string
}

export const sendEventConfirmationEmail = async (params: EmailParams): Promise<boolean> => {
  try {
    if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
      console.error('EmailJS configuration is missing')
      return false
    }

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      params as unknown as Record<string, unknown>,
      EMAILJS_PUBLIC_KEY
    )

    console.log('Email sent successfully:', result)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

export const generateConfirmationLink = (eventId: string, photographerId: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return `${baseUrl}/confirm-event?eventId=${eventId}&photographerId=${photographerId}`
} 