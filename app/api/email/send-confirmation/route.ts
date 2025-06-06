import { NextRequest, NextResponse } from 'next/server';
import { sendEventConfirmationEmail, generateConfirmationLink } from '@/lib/email-service';

export interface ConfirmationEmailRequest {
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

export async function POST(request: NextRequest) {
  try {
    const { photographerEmails, eventData, eventId }: ConfirmationEmailRequest = await request.json();

    // Validate required fields
    if (!photographerEmails?.length || !eventData?.title || !eventId) {
      return NextResponse.json(
        { success: false, message: 'Missing required data' },
        { status: 400 }
      );
    }

    let sentCount = 0;
    let errors = 0;
    const emailResults: Array<{ email: string; success: boolean; error?: string }> = [];

    // Send confirmation emails to each photographer
    for (const photographer of photographerEmails) {
      try {
        const confirmationLink = generateConfirmationLink(eventId, photographer.photographerId);

        const emailSent = await sendEventConfirmationEmail({
          to_email: photographer.email,
          to_name: photographer.name,
          event_title: eventData.title,
          event_date: eventData.date,
          event_location: eventData.location,
          event_description: eventData.description,
          confirmation_link: confirmationLink,
          note_to_photographer: eventData.noteToPhotographer,
        });

        if (emailSent) {
          sentCount++;
          emailResults.push({ email: photographer.email, success: true });
        } else {
          errors++;
          emailResults.push({ 
            email: photographer.email, 
            success: false, 
            error: 'Failed to send email'
          });
        }
      } catch (error) {
        errors++;
        emailResults.push({ 
          email: photographer.email, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        console.error(`Error sending confirmation email to ${photographer.email}:`, error);
      }
    }

    return NextResponse.json({
      success: sentCount > 0,
      message: `Sent ${sentCount} confirmation emails, ${errors} errors`,
      sentCount,
      errors,
      results: emailResults
    });
  } catch (error) {
    console.error('Confirmation email API error:', error);
    return NextResponse.json(
      { success: false, message: 'Error sending confirmation emails' },
      { status: 500 }
    );
  }
} 