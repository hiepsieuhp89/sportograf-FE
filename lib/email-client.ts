// Client-side wrapper for email operations
// This file only contains API call functions, no server-side imports

export interface ConfirmationEmailData {
  photographerEmails: Array<{
    email: string;
    name: string;
    photographerId: string;
  }>;
  eventData: {
    title: string;
    date: string;
    location: string;
    description: string;
    noteToPhotographer?: string;
  };
  eventId: string;
}

export interface NewsletterNotificationData {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventDescription: string;
  eventId: string;
  eventImage?: string;
  excludeEmails?: string[];
}

/**
 * Send confirmation emails to photographers via API
 */
export const sendConfirmationEmails = async (data: ConfirmationEmailData) => {
  try {
    const response = await fetch('/api/email/send-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to send confirmation emails');
    }

    return result;
  } catch (error) {
    console.error('Error sending confirmation emails:', error);
    throw error;
  }
};

/**
 * Send newsletter notification via API
 */
export const sendNewsletterNotification = async (data: NewsletterNotificationData) => {
  try {
    const response = await fetch('/api/newsletter/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to send newsletter notification');
    }

    return result;
  } catch (error) {
    console.error('Error sending newsletter notification:', error);
    throw error;
  }
};

/**
 * Helper function to prepare photographer email data
 */
export const preparePhotographerEmails = (
  photographerIds: string[],
  photographers: Array<{ id: string; name: string; email: string }>
): Array<{ email: string; name: string; photographerId: string }> => {
  return photographerIds
    .map(photographerId => {
      const photographer = photographers.find(p => p.id === photographerId);
      if (photographer) {
        return {
          email: photographer.email,
          name: photographer.name,
          photographerId: photographerId
        };
      }
      return null;
    })
    .filter(Boolean) as Array<{ email: string; name: string; photographerId: string }>;
}; 