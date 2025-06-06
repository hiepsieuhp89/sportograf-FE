import nodemailer, { Transporter } from 'nodemailer'
import { google } from 'googleapis'

// Gmail API configuration
const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID || ''
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET || ''
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN || ''
const GMAIL_USER = process.env.GMAIL_USER || ''

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

// Create OAuth2 client
const createTransporter = async (): Promise<Transporter> => {
  const oAuth2Client = new google.auth.OAuth2(
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  )

  oAuth2Client.setCredentials({
    refresh_token: GMAIL_REFRESH_TOKEN
  })

  const accessToken = await oAuth2Client.getAccessToken()

  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: GMAIL_USER,
      clientId: GMAIL_CLIENT_ID,
      clientSecret: GMAIL_CLIENT_SECRET,
      refreshToken: GMAIL_REFRESH_TOKEN,
      accessToken: accessToken.token as string
    }
  })

  return transporter
}

export const sendEventConfirmationEmail = async (params: EmailParams): Promise<boolean> => {
  try {
    if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN || !GMAIL_USER) {
      console.error('Gmail configuration is missing')
      return false
    }

    const transporter = await createTransporter()

    // Create HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Event Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background-color: #f8f9fa; }
          .event-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Event Assignment Confirmation</h1>
          </div>
          <div class="content">
            <p>Dear ${params.to_name},</p>
            <p>You have been assigned to photograph the following event:</p>
            
            <div class="event-details">
              <h2>${params.event_title}</h2>
              <p><strong>Date:</strong> ${params.event_date}</p>
              <p><strong>Location:</strong> ${params.event_location}</p>
              <p><strong>Description:</strong> ${params.event_description}</p>
              ${params.note_to_photographer ? `<p><strong>Special Notes:</strong> ${params.note_to_photographer}</p>` : ''}
            </div>
            
            <p>Please confirm your availability by clicking the button below:</p>
            <a href="${params.confirmation_link}" class="button">Confirm Attendance</a>
            
            <p>If you cannot attend this event, please contact us as soon as possible.</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>Sportograf Team</p>
          </div>
        </div>
      </body>
      </html>
    `

    const mailOptions = {
      from: `Sportograf <${GMAIL_USER}>`,
      to: params.to_email,
      subject: `Event Assignment: ${params.event_title}`,
      html: htmlContent
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', result.messageId)
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