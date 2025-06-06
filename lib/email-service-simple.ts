import nodemailer, { Transporter } from 'nodemailer'

// Gmail SMTP configuration
const GMAIL_USER = process.env.GMAIL_USER || ''
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || ''

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

// Create simple SMTP transporter
const createTransporter = (): Transporter => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD
    }
  })
}

export const sendEventConfirmationEmail = async (params: EmailParams): Promise<boolean> => {
  try {
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      console.error('Gmail SMTP configuration is missing')
      return false
    }

    const transporter = createTransporter()

    // Create HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Event Confirmation</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f4f6f8;
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background-color: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
          }
          .content { 
            padding: 30px; 
          }
          .event-details { 
            background-color: #f8f9fa; 
            padding: 25px; 
            border-radius: 8px; 
            margin: 25px 0;
            border-left: 4px solid #667eea;
          }
          .event-details h2 {
            margin-top: 0;
            color: #2d3748;
            font-size: 20px;
          }
          .detail-item {
            margin: 12px 0;
            display: flex;
            align-items: flex-start;
          }
          .detail-label {
            font-weight: 600;
            color: #4a5568;
            min-width: 100px;
            margin-right: 10px;
          }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            margin: 25px 0;
            font-weight: 600;
            text-align: center;
            transition: transform 0.2s;
          }
          .button:hover {
            transform: translateY(-2px);
          }
          .footer { 
            text-align: center; 
            padding: 25px; 
            color: #718096;
            background-color: #f7fafc;
            border-top: 1px solid #e2e8f0;
          }
          .note-section {
            background-color: #fff5f5;
            border: 1px solid #fed7d7;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .note-section h3 {
            color: #c53030;
            margin-top: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📸 Event Assignment</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">You have a new photography assignment</p>
          </div>
          
          <div class="content">
            <p>Dear <strong>${params.to_name}</strong>,</p>
            <p>You have been assigned to photograph the following event. Please review the details below:</p>
            
            <div class="event-details">
              <h2>${params.event_title}</h2>
              
              <div class="detail-item">
                <span class="detail-label">📅 Date:</span>
                <span>${params.event_date}</span>
              </div>
              
              <div class="detail-item">
                <span class="detail-label">📍 Location:</span>
                <span>${params.event_location}</span>
              </div>
              
              <div class="detail-item">
                <span class="detail-label">📝 Description:</span>
                <span>${params.event_description}</span>
              </div>
            </div>
            
            ${params.note_to_photographer ? `
              <div class="note-section">
                <h3>⚠️ Special Instructions</h3>
                <p>${params.note_to_photographer}</p>
              </div>
            ` : ''}
            
            <p><strong>Please confirm your availability:</strong></p>
            <div style="text-align: center;">
              <a href="${params.confirmation_link}" class="button">✅ Confirm Attendance</a>
            </div>
            
            <p>⏰ <strong>Important:</strong> If you cannot attend this event, please contact us as soon as possible so we can arrange alternative coverage.</p>
          </div>
          
          <div class="footer">
            <p><strong>Sportograf Team</strong></p>
            <p>📧 For questions, please reply to this email</p>
          </div>
        </div>
      </body>
      </html>
    `

    const mailOptions = {
      from: `"Sportograf Assignment" <${GMAIL_USER}>`,
      to: params.to_email,
      subject: `📸 Event Assignment: ${params.event_title}`,
      html: htmlContent,
      // Also include plain text version
      text: `
        Dear ${params.to_name},
        
        You have been assigned to photograph: ${params.event_title}
        
        Event Details:
        - Date: ${params.event_date}
        - Location: ${params.event_location}
        - Description: ${params.event_description}
        ${params.note_to_photographer ? `- Special Notes: ${params.note_to_photographer}` : ''}
        
        Please confirm your attendance: ${params.confirmation_link}
        
        Best regards,
        Sportograf Team
      `
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