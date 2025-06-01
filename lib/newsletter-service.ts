import { db } from './firebase';
import { collection, doc, setDoc, deleteDoc, getDoc, getDocs, query, where } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

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

// Initialize EmailJS
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_sportograf';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_NEWSLETTER_TEMPLATE_ID || 'template_newsletter';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'your_public_key';

emailjs.init(EMAILJS_PUBLIC_KEY);

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
  static async sendEventNotification(eventData: EventNotificationData): Promise<{ success: boolean; sentCount: number; errors: number }> {
    try {
      const subscribers = await this.getActiveSubscribers();
      let sentCount = 0;
      let errors = 0;

      const emailPromises = subscribers.map(async (subscriber) => {
        try {
          const templateParams = {
            to_email: subscriber.email,
            to_name: subscriber.email.split('@')[0], // Use email prefix as name
            event_title: eventData.eventTitle,
            event_date: eventData.eventDate,
            event_location: eventData.eventLocation,
            event_description: eventData.eventDescription,
            event_link: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://sportograf.com'}/events/${eventData.eventId}`,
            unsubscribe_link: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://sportograf.com'}/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}`,
            event_image: eventData.eventImage || '',
            language: subscriber.language || 'en'
          };

          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
          );

          sentCount++;
        } catch (error) {
          console.error(`Error sending email to ${subscriber.email}:`, error);
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