import { db } from './firebase';
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
      if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
        console.error('Gmail SMTP configuration is missing for newsletter');
        return { success: false, sentCount: 0, errors: 1 };
      }

      const allSubscribers = await this.getActiveSubscribers();
      // Filter out excluded emails (e.g., photographers who already received confirmation emails)
      const subscribers = allSubscribers.filter(subscriber => !excludeEmails.includes(subscriber.email));
      
      let sentCount = 0;
      let errors = 0;

      const transporter = createNewsletterTransporter();

      const emailPromises = subscribers.map(async (subscriber) => {
        try {
          const subscriberName = subscriber.email.split('@')[0];
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sportograf.com';
          
          // Create HTML email template for newsletter
          const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>New Event - ${eventData.eventTitle}</title>
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
                .event-card { 
                  background-color: #f8f9fa; 
                  padding: 25px; 
                  border-radius: 8px; 
                  margin: 25px 0;
                  border-left: 4px solid #667eea;
                }
                .event-card h2 {
                  margin-top: 0;
                  color: #2d3748;
                  font-size: 20px;
                }
                .event-image {
                  width: 100%;
                  max-width: 400px;
                  height: 200px;
                  object-fit: cover;
                  border-radius: 8px;
                  margin: 15px 0;
                }
                .detail-item {
                  margin: 12px 0;
                  display: flex;
                  align-items: flex-start;
                }
                .detail-label {
                  font-weight: 600;
                  color: #4a5568;
                  min-width: 80px;
                  margin-right: 10px;
                }
                .button { 
                  display: inline-block; 
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white; 
                  padding: 15px 30px; 
                  text-decoration: none; 
                  border-radius: 8px; 
                  margin: 25px 10px 25px 0;
                  font-weight: 600;
                  text-align: center;
                }
                .button-secondary { 
                  display: inline-block; 
                  background: #6b7280;
                  color: white; 
                  padding: 10px 20px; 
                  text-decoration: none; 
                  border-radius: 6px; 
                  margin: 25px 0;
                  font-size: 12px;
                }
                .footer { 
                  text-align: center; 
                  padding: 25px; 
                  color: #718096;
                  background-color: #f7fafc;
                  border-top: 1px solid #e2e8f0;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎯 New Event Available!</h1>
                  <p style="margin: 10px 0 0 0; opacity: 0.9;">A new photography event has been added</p>
                </div>
                
                <div class="content">
                  <p>Hi <strong>${subscriberName}</strong>,</p>
                  <p>We have an exciting new event that might interest you:</p>
                  
                  <div class="event-card">
                    <h2>${eventData.eventTitle}</h2>
                    ${eventData.eventImage ? `<img src="${eventData.eventImage}" alt="${eventData.eventTitle}" class="event-image" />` : ''}
                    
                    <div class="detail-item">
                      <span class="detail-label">📅 Date:</span>
                      <span>${eventData.eventDate}</span>
                    </div>
                    
                    <div class="detail-item">
                      <span class="detail-label">📍 Location:</span>
                      <span>${eventData.eventLocation}</span>
                    </div>
                    
                    <div class="detail-item">
                      <span class="detail-label">📝 Description:</span>
                      <span>${eventData.eventDescription}</span>
                    </div>
                  </div>
                  
                  <div style="text-align: center;">
                    <a href="${baseUrl}/events/${eventData.eventId}" class="button">📸 View Event Details</a>
                  </div>
                  
                  <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
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
        } catch (error) {
          console.error(`Error sending newsletter email to ${subscriber.email}:`, error);
          errors++;
        }
      });

      await Promise.allSettled(emailPromises);

      return {
        success: sentCount > 0,
        sentCount,
        errors
      };
    } catch (error) {
      console.error('Error sending event notifications:', error);
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