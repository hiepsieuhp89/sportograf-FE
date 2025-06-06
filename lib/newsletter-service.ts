import { db } from './firebase-server';
import { collection, doc, setDoc, deleteDoc, getDoc, getDocs, query, where } from 'firebase/firestore';
import nodemailer, { Transporter } from 'nodemailer';

export interface NewsletterSubscriber {
  email: string;
  subscribedAt: Date;
  isActive: boolean;
  language?: string;
}

export interface EventNotificationData {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventDescription: string;
  eventId: string;
  eventImage?: string;
}

// Gmail SMTP configuration
const GMAIL_USER = process.env.GMAIL_USER || '';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || '';

// Create Gmail transporter
const createNewsletterTransporter = (): Transporter => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD
    }
  });
};

export class NewsletterService {
  private static readonly COLLECTION_NAME = 'newsletter_subscribers';

  /**
   * Subscribe a user to the newsletter
   */
  static async subscribe(email: string, language: string = 'en'): Promise<{ success: boolean; message: string }> {
    try {
      const subscriberRef = doc(db, this.COLLECTION_NAME, email);
      const subscriberDoc = await getDoc(subscriberRef);

      if (subscriberDoc.exists() && subscriberDoc.data().isActive) {
        return {
          success: false,
          message: 'alreadySubscribed'
        };
      }

      const subscriberData: NewsletterSubscriber = {
        email,
        subscribedAt: new Date(),
        isActive: true,
        language
      };

      await setDoc(subscriberRef, subscriberData);

      return {
        success: true,
        message: 'subscriptionSuccessful'
      };
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      return {
        success: false,
        message: 'subscriptionError'
      };
    }
  }

  /**
   * Unsubscribe a user from the newsletter
   */
  static async unsubscribe(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const subscriberRef = doc(db, this.COLLECTION_NAME, email);
      const subscriberDoc = await getDoc(subscriberRef);

      if (!subscriberDoc.exists() || !subscriberDoc.data().isActive) {
        return {
          success: false,
          message: 'notSubscribed'
        };
      }

      await deleteDoc(subscriberRef);

      return {
        success: true,
        message: 'unsubscriptionSuccessful'
      };
    } catch (error) {
      console.error('Error unsubscribing from newsletter:', error);
      return {
        success: false,
        message: 'unsubscriptionError'
      };
    }
  }

  /**
   * Check if a user is subscribed to the newsletter
   */
  static async isSubscribed(email: string): Promise<boolean> {
    try {
      const subscriberRef = doc(db, this.COLLECTION_NAME, email);
      const subscriberDoc = await getDoc(subscriberRef);
      
      return subscriberDoc.exists() && subscriberDoc.data().isActive;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }

  /**
   * Get all active subscribers
   */
  static async getActiveSubscribers(): Promise<NewsletterSubscriber[]> {
    try {
      const subscribersRef = collection(db, this.COLLECTION_NAME);
      const q = query(subscribersRef, where('isActive', '==', true));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        subscribedAt: doc.data().subscribedAt.toDate()
      })) as NewsletterSubscriber[];
    } catch (error) {
      console.error('Error getting active subscribers:', error);
      return [];
    }
  }

  /**
   * Send event notification to all subscribers
   */
  static async sendEventNotification(eventData: EventNotificationData, excludeEmails: string[] = []): Promise<{ success: boolean; sentCount: number; errors: number }> {
    try {
      console.log('[Newsletter] Starting event notification process for event:', eventData.eventTitle);
      
      if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
        console.error('[Newsletter] Gmail SMTP configuration is missing for newsletter');
        return { success: false, sentCount: 0, errors: 1 };
      }

      const allSubscribers = await this.getActiveSubscribers();
      console.log(`[Newsletter] Total active subscribers: ${allSubscribers.length}`);
      
      // Filter out excluded emails (e.g., photographers who already received confirmation emails)
      const subscribers = allSubscribers.filter(subscriber => !excludeEmails.includes(subscriber.email));
      console.log(`[Newsletter] Subscribers after exclusion: ${subscribers.length} (Excluded ${excludeEmails.length} emails)`);
      
      let sentCount = 0;
      let errors = 0;

      const transporter = createNewsletterTransporter();
      console.log('[Newsletter] Email transporter created successfully');

      const emailPromises = subscribers.map(async (subscriber) => {
        try {
          console.log(`[Newsletter] Attempting to send notification to: ${subscriber.email}`);
          const subscriberName = subscriber.email.split('@')[0];
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sportograf.com';
          
          // Create HTML email template for newsletter
          const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>New Event - ${eventData.eventTitle}</title>
              <style>
                /* Reset styles */
                * { 
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                  line-height: 1.6; 
                  color: #1a1a1a; 
                  background-color: #f4f6f8;
                  -webkit-font-smoothing: antialiased;
                  -moz-osx-font-smoothing: grayscale;
                }
                
                .container { 
                  max-width: 600px; 
                  margin: 20px auto; 
                  background-color: white;
                  border-radius: 16px;
                  overflow: hidden;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                
                .header { 
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white; 
                  padding: 40px 20px; 
                  text-align: center; 
                }
                
                .header h1 {
                  margin: 0;
                  font-size: 28px;
                  font-weight: 700;
                  letter-spacing: -0.5px;
                }
                
                .header p {
                  margin: 10px 0 0 0;
                  opacity: 0.9;
                  font-size: 16px;
                }
                
                .content { 
                  padding: 32px; 
                }
                
                .event-card { 
                  background-color: #f8fafc; 
                  padding: 24px; 
                  border-radius: 12px; 
                  margin: 24px 0;
                  border-left: 4px solid #667eea;
                }
                
                .event-card h2 {
                  margin: 0 0 16px 0;
                  color: #1e293b;
                  font-size: 20px;
                  font-weight: 600;
                }
                
                .event-image {
                  width: 100%;
                  max-width: 400px;
                  height: 200px;
                  object-fit: cover;
                  border-radius: 12px;
                  margin: 16px auto;
                  display: block;
                }
                
                .detail-item {
                  margin: 16px 0;
                  display: flex;
                  align-items: flex-start;
                }
                
                .detail-label {
                  font-weight: 600;
                  color: #475569;
                  min-width: 100px;
                  margin-right: 12px;
                }
                
                .detail-content {
                  color: #334155;
                  flex: 1;
                }
                
                .button { 
                  display: inline-block; 
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white; 
                  padding: 16px 32px; 
                  text-decoration: none; 
                  border-radius: 8px; 
                  margin: 24px 0;
                  font-weight: 600;
                  font-size: 16px;
                  text-align: center;
                  transition: all 0.2s ease;
                }
                
                .button:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
                
                .button-secondary { 
                  display: inline-block; 
                  background: #64748b;
                  color: white; 
                  padding: 12px 24px; 
                  text-decoration: none; 
                  border-radius: 6px; 
                  margin: 16px 0;
                  font-size: 14px;
                }
                
                .footer { 
                  text-align: center; 
                  padding: 24px; 
                  color: #64748b;
                  background-color: #f8fafc;
                  border-top: 1px solid #e2e8f0;
                }
                
                .footer p {
                  margin: 8px 0;
                  font-size: 14px;
                }
                
                .footer strong {
                  color: #475569;
                }
                
                /* Mobile Responsive */
                @media only screen and (max-width: 600px) {
                  .container {
                    margin: 0;
                    border-radius: 0;
                  }
                  
                  .content {
                    padding: 24px 16px;
                  }
                  
                  .event-card {
                    padding: 20px 16px;
                  }
                  
                  .detail-item {
                    flex-direction: column;
                  }
                  
                  .detail-label {
                    margin-bottom: 4px;
                  }
                  
                  .button {
                    display: block;
                    width: 100%;
                    text-align: center;
                  }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎯 New Event Available!</h1>
                  <p>A new photography event has been added</p>
                </div>
                
                <div class="content">
                  <p>Hi <strong>${subscriberName}</strong>,</p>
                  <p>We have an exciting new event that might interest you:</p>
                  
                  <div class="event-card">
                    <h2>${eventData.eventTitle}</h2>
                    ${eventData.eventImage ? `<img src="${eventData.eventImage}" alt="${eventData.eventTitle}" class="event-image" />` : ''}
                    
                    <div class="detail-item">
                      <span class="detail-label">📅 Date</span>
                      <span class="detail-content">${eventData.eventDate}</span>
                    </div>
                    
                    <div class="detail-item">
                      <span class="detail-label">📍 Location</span>
                      <span class="detail-content">${eventData.eventLocation}</span>
                    </div>
                    
                    <div class="detail-item">
                      <span class="detail-label">📝 Description</span>
                      <span class="detail-content">${eventData.eventDescription}</span>
                    </div>
                  </div>
                  
                  <div style="text-align: center;">
                    <a href="${baseUrl}/events/${eventData.eventId}" class="button">📸 View Event Details</a>
                  </div>
                  
                  <p style="margin-top: 24px; font-size: 15px; color: #475569;">
                    Don't miss out on this amazing photography opportunity!
                  </p>
                </div>
                
                <div class="footer">
                  <p><strong>Sportograf Team</strong></p>
                  <p>📧 You received this because you subscribed to our newsletter</p>
                  <a href="${baseUrl}/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}" class="button-secondary">Unsubscribe</a>
                </div>
              </div>
            </body>
            </html>
          `;

          const mailOptions = {
            from: `"Sportograf Newsletter" <${GMAIL_USER}>`,
            to: subscriber.email,
            subject: `🎯 New Event: ${eventData.eventTitle}`,
            html: htmlContent,
            text: `
              Hi ${subscriberName},
              
              New Event: ${eventData.eventTitle}
              
              Event Details:
              - Date: ${eventData.eventDate}
              - Location: ${eventData.eventLocation}
              - Description: ${eventData.eventDescription}
              
              View event: ${baseUrl}/events/${eventData.eventId}
              
              Unsubscribe: ${baseUrl}/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}
              
              Best regards,
              Sportograf Team
            `
          };

          await transporter.sendMail(mailOptions);
          sentCount++;
          console.log(`[Newsletter] Successfully sent notification to: ${subscriber.email}`);
        } catch (error) {
          console.error(`[Newsletter] Error sending newsletter email to ${subscriber.email}:`, error);
          errors++;
        }
      });

      await Promise.allSettled(emailPromises);
      console.log(`[Newsletter] Event notification process completed. Sent: ${sentCount}, Errors: ${errors}`);

      return {
        success: sentCount > 0,
        sentCount,
        errors
      };
    } catch (error) {
      console.error('[Newsletter] Error in sendEventNotification:', error);
      return {
        success: false,
        sentCount: 0,
        errors: 1
      };
    }
  }

  /**
   * Send event update notification to all subscribers
   */
  static async sendEventUpdateNotification(eventData: EventNotificationData & { changes: string[] }): Promise<{ success: boolean; sentCount: number; errors: number }> {
    try {
      console.log('[Newsletter] Starting event update notification process for event:', eventData.eventTitle);
      console.log('[Newsletter] Changes to be notified:', eventData.changes);
      
      if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
        console.error('[Newsletter] Gmail SMTP configuration is missing for newsletter');
        return { success: false, sentCount: 0, errors: 1 };
      }

      const allSubscribers = await this.getActiveSubscribers();
      console.log(`[Newsletter] Total subscribers to notify: ${allSubscribers.length}`);
      
      let sentCount = 0;
      let errors = 0;

      const transporter = createNewsletterTransporter();
      console.log('[Newsletter] Email transporter created successfully');

      const emailPromises = allSubscribers.map(async (subscriber) => {
        try {
          console.log(`[Newsletter] Attempting to send update notification to: ${subscriber.email}`);
          const subscriberName = subscriber.email.split('@')[0];
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sportograf.com';
          
          // Create changes list HTML
          const changesHtml = eventData.changes.length > 0 
            ? `
              <div style="background-color: #fff5f5; border: 1px solid #fed7d7; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #c53030; margin-top: 0;">🔄 What's Changed:</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  ${eventData.changes.map(change => `<li style="margin: 5px 0;">${change}</li>`).join('')}
                </ul>
              </div>
            `
            : '';

          // Create HTML email template for update newsletter
          const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Event Updated - ${eventData.eventTitle}</title>
              <style>
                /* Reset styles */
                * { 
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                  line-height: 1.6; 
                  color: #1a1a1a; 
                  background-color: #f4f6f8;
                  -webkit-font-smoothing: antialiased;
                  -moz-osx-font-smoothing: grayscale;
                }
                
                .container { 
                  max-width: 600px; 
                  margin: 20px auto; 
                  background-color: white;
                  border-radius: 16px;
                  overflow: hidden;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                
                .header { 
                  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                  color: white; 
                  padding: 40px 20px; 
                  text-align: center; 
                }
                
                .header h1 {
                  margin: 0;
                  font-size: 28px;
                  font-weight: 700;
                  letter-spacing: -0.5px;
                }
                
                .header p {
                  margin: 10px 0 0 0;
                  opacity: 0.9;
                  font-size: 16px;
                }
                
                .content { 
                  padding: 32px; 
                }
                
                .event-card { 
                  background-color: #f8fafc; 
                  padding: 24px; 
                  border-radius: 12px; 
                  margin: 24px 0;
                  border-left: 4px solid #f59e0b;
                }
                
                .event-card h2 {
                  margin: 0 0 16px 0;
                  color: #1e293b;
                  font-size: 20px;
                  font-weight: 600;
                }
                
                .event-image {
                  width: 100%;
                  max-width: 400px;
                  height: 200px;
                  object-fit: cover;
                  border-radius: 12px;
                  margin: 16px auto;
                  display: block;
                }
                
                .detail-item {
                  margin: 16px 0;
                  display: flex;
                  align-items: flex-start;
                }
                
                .detail-label {
                  font-weight: 600;
                  color: #475569;
                  min-width: 100px;
                  margin-right: 12px;
                }
                
                .detail-content {
                  color: #334155;
                  flex: 1;
                }
                
                .button { 
                  display: inline-block; 
                  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                  color: white; 
                  padding: 16px 32px; 
                  text-decoration: none; 
                  border-radius: 8px; 
                  margin: 24px 0;
                  font-weight: 600;
                  font-size: 16px;
                  text-align: center;
                  transition: all 0.2s ease;
                }
                
                .button:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
                
                .button-secondary { 
                  display: inline-block; 
                  background: #64748b;
                  color: white; 
                  padding: 12px 24px; 
                  text-decoration: none; 
                  border-radius: 6px; 
                  margin: 16px 0;
                  font-size: 14px;
                }
                
                .footer { 
                  text-align: center; 
                  padding: 24px; 
                  color: #64748b;
                  background-color: #f8fafc;
                  border-top: 1px solid #e2e8f0;
                }
                
                .footer p {
                  margin: 8px 0;
                  font-size: 14px;
                }
                
                .footer strong {
                  color: #475569;
                }
                
                /* Mobile Responsive */
                @media only screen and (max-width: 600px) {
                  .container {
                    margin: 0;
                    border-radius: 0;
                  }
                  
                  .content {
                    padding: 24px 16px;
                  }
                  
                  .event-card {
                    padding: 20px 16px;
                  }
                  
                  .detail-item {
                    flex-direction: column;
                  }
                  
                  .detail-label {
                    margin-bottom: 4px;
                  }
                  
                  .button {
                    display: block;
                    width: 100%;
                    text-align: center;
                  }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🔄 Event Updated!</h1>
                  <p>An event you might be interested in has been updated</p>
                </div>
                
                <div class="content">
                  <p>Hi <strong>${subscriberName}</strong>,</p>
                  <p>An event has been updated with important changes:</p>
                  
                  <div class="event-card">
                    <h2>${eventData.eventTitle}</h2>
                    ${eventData.eventImage ? `<img src="${eventData.eventImage}" alt="${eventData.eventTitle}" class="event-image" />` : ''}
                    
                    <div class="detail-item">
                      <span class="detail-label">📅 Date</span>
                      <span class="detail-content">${eventData.eventDate}</span>
                    </div>
                    
                    <div class="detail-item">
                      <span class="detail-label">📍 Location</span>
                      <span class="detail-content">${eventData.eventLocation}</span>
                    </div>
                    
                    <div class="detail-item">
                      <span class="detail-label">📝 Description</span>
                      <span class="detail-content">${eventData.eventDescription}</span>
                    </div>
                  </div>
                  
                  ${changesHtml}
                  
                  <div style="text-align: center;">
                    <a href="${baseUrl}/events/${eventData.eventId}" class="button">📸 View Updated Event</a>
                  </div>
                  
                  <p style="margin-top: 24px; font-size: 15px; color: #475569;">
                    Make sure to check out the latest event details!
                  </p>
                </div>
                
                <div class="footer">
                  <p><strong>Sportograf Team</strong></p>
                  <p>📧 You received this because you subscribed to our newsletter</p>
                  <a href="${baseUrl}/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}" class="button-secondary">Unsubscribe</a>
                </div>
              </div>
            </body>
            </html>
          `;

          const mailOptions = {
            from: `"Sportograf Newsletter" <${GMAIL_USER}>`,
            to: subscriber.email,
            subject: `🔄 Event Updated: ${eventData.eventTitle}`,
            html: htmlContent,
            text: `
              Hi ${subscriberName},
              
              Event Updated: ${eventData.eventTitle}
              
              Event Details:
              - Date: ${eventData.eventDate}
              - Location: ${eventData.eventLocation}
              - Description: ${eventData.eventDescription}
              
              ${eventData.changes.length > 0 ? `Changes made:\n${eventData.changes.map(change => `- ${change}`).join('\n')}` : ''}
              
              View event: ${baseUrl}/events/${eventData.eventId}
              
              Unsubscribe: ${baseUrl}/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}
              
              Best regards,
              Sportograf Team
            `
          };

          await transporter.sendMail(mailOptions);
          sentCount++;
          console.log(`[Newsletter] Successfully sent update notification to: ${subscriber.email}`);
        } catch (error) {
          console.error(`[Newsletter] Error sending update newsletter email to ${subscriber.email}:`, error);
          errors++;
        }
      });

      await Promise.allSettled(emailPromises);
      console.log(`[Newsletter] Event update notification process completed. Sent: ${sentCount}, Errors: ${errors}`);

      return {
        success: sentCount > 0,
        sentCount,
        errors
      };
    } catch (error) {
      console.error('[Newsletter] Error in sendEventUpdateNotification:', error);
      return {
        success: false,
        sentCount: 0,
        errors: 1
      };
    }
  }

  /**
   * Get subscription statistics
   */
  static async getSubscriptionStats(): Promise<{ totalSubscribers: number; activeSubscribers: number }> {
    try {
      const subscribersRef = collection(db, this.COLLECTION_NAME);
      const allSubscribers = await getDocs(subscribersRef);
      const activeSubscribers = await getDocs(query(subscribersRef, where('isActive', '==', true)));

      return {
        totalSubscribers: allSubscribers.size,
        activeSubscribers: activeSubscribers.size
      };
    } catch (error) {
      console.error('Error getting subscription stats:', error);
      return {
        totalSubscribers: 0,
        activeSubscribers: 0
      };
    }
  }
} 