import { NextRequest, NextResponse } from 'next/server';
import { NewsletterService } from '@/lib/newsletter-service';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    const result = await NewsletterService.unsubscribe(email);

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 404 }); // Not found for not subscribed
    }
  } catch (error) {
    console.error('Newsletter unsubscription error:', error);
    return NextResponse.json(
      { success: false, message: 'unsubscriptionError' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Auto-unsubscribe via GET request (for email links)
    const result = await NewsletterService.unsubscribe(email);

    return NextResponse.json({
      success: true,
      message: result.success ? 'unsubscriptionSuccessful' : 'notSubscribed',
      redirectTo: '/newsletter/unsubscribe-success'
    });
  } catch (error) {
    console.error('Newsletter unsubscription error:', error);
    return NextResponse.json(
      { success: false, message: 'unsubscriptionError' },
      { status: 500 }
    );
  }
} 