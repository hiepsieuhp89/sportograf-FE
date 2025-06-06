import { NextRequest, NextResponse } from 'next/server';
import { NewsletterService, EventNotificationData } from '@/lib/newsletter-service';

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { excludeEmails = [], ...eventData }: { excludeEmails?: string[] } & EventNotificationData = requestBody;

    // Validate required fields
    if (!eventData.eventTitle || !eventData.eventDate || !eventData.eventLocation || !eventData.eventId) {
      return NextResponse.json(
        { success: false, message: 'Missing required event data' },
        { status: 400 }
      );
    }

    // Send notifications to all subscribers except excluded emails
    const result = await NewsletterService.sendEventNotification(eventData, excludeEmails);

    return NextResponse.json({
      success: result.success,
      message: result.success 
        ? `Event notification sent to ${result.sentCount} subscribers` 
        : 'Failed to send event notifications',
      sentCount: result.sentCount,
      errors: result.errors
    });
  } catch (error) {
    console.error('Event notification error:', error);
    return NextResponse.json(
      { success: false, message: 'Error sending event notifications' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get subscription statistics
    const stats = await NewsletterService.getSubscriptionStats();

    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Newsletter stats error:', error);
    return NextResponse.json(
      { success: false, message: 'Error getting newsletter statistics' },
      { status: 500 }
    );
  }
} 