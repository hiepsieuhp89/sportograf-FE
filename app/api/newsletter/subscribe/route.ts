import { NextRequest, NextResponse } from 'next/server';
import { NewsletterService } from '@/lib/newsletter-service';

export async function POST(request: NextRequest) {
  try {
    const { email, language } = await request.json();

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

    const result = await NewsletterService.subscribe(email, language || 'en');

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 409 }); // Conflict for already subscribed
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'subscriptionError' },
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

    const isSubscribed = await NewsletterService.isSubscribed(email);

    return NextResponse.json({
      success: true,
      isSubscribed,
      message: isSubscribed ? 'subscribed' : 'unsubscribed'
    });
  } catch (error) {
    console.error('Newsletter status check error:', error);
    return NextResponse.json(
      { success: false, message: 'Error checking subscription status' },
      { status: 500 }
    );
  }
} 