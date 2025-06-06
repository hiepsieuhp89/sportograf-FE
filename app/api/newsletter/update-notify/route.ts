import { NextRequest, NextResponse } from 'next/server';
import { NewsletterService } from '@/lib/newsletter-service';

export interface EventUpdateNotificationData {
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventDescription: string;
  eventId: string;
  eventImage?: string;
  changes: string[];
}

export async function POST(request: NextRequest) {
  try {
    const eventData: EventUpdateNotificationData = await request.json();

    // Validate required fields
    if (!eventData.eventTitle || !eventData.eventDate || !eventData.eventLocation || !eventData.eventId) {
      return NextResponse.json(
        { success: false, message: 'Missing required event data' },
        { status: 400 }
      );
    }

    // Send update notifications to all subscribers
    const result = await NewsletterService.sendEventUpdateNotification(eventData);

    return NextResponse.json({
      success: result.success,
      message: result.success 
        ? `Event update notification sent to ${result.sentCount} subscribers` 
        : 'Failed to send event update notifications',
      sentCount: result.sentCount,
      errors: result.errors
    });
  } catch (error) {
    console.error('Event update notification error:', error);
    return NextResponse.json(
      { success: false, message: 'Error sending event update notifications' },
      { status: 500 }
    );
  }
} 