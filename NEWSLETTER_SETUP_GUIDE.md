# Newsletter Subscription Setup Guide

This guide will help you set up the complete newsletter subscription feature for Sportograf, including email notifications for new events.

## Features Implemented

✅ **Newsletter Subscription System**
- Subscribe/unsubscribe functionality
- Firebase Firestore integration for subscriber management
- Multilingual support (EN, DE, FR, ES)
- Real-time subscription status checking

✅ **Email Notifications**
- Automatic email notifications when new events are created
- EmailJS integration for reliable email delivery
- Unsubscribe links in all emails
- Event details and images in notifications

✅ **Login Page Integration**
- Optional newsletter subscription during login
- Magic link explanation with toggle functionality
- Modern UI with gradient backgrounds

✅ **Admin Integration**
- Automatic newsletter notifications when events are created
- No impact on event creation if email fails

## Setup Instructions

### 1. EmailJS Configuration

EmailJS is already configured in your project. Follow these steps to set it up:

#### A. Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Create a new service (Gmail, Outlook, etc.)

#### B. Configure Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail recommended)
4. Follow the authentication steps
5. Note down your **Service ID** (e.g., `service_sportograf`)

#### C. Create Email Templates
Create two email templates in EmailJS:

**Template 1: Newsletter Event Notification**
- Template ID: `template_newsletter`
- Subject: `New Event: {{event_title}}`
- Content:
```html
<h2>{{event_title}}</h2>
<p>Hello {{to_name}},</p>
<p>A new event is now available on Sportograf!</p>

<div style="border: 1px solid #ddd; padding: 20px; margin: 20px 0; border-radius: 8px;">
  <h3>{{event_title}}</h3>
  <p><strong>Date:</strong> {{event_date}}</p>
  <p><strong>Location:</strong> {{event_location}}</p>
  <p><strong>Description:</strong> {{event_description}}</p>
  {{#event_image}}
  <img src="{{event_image}}" alt="Event Image" style="max-width: 100%; height: auto; margin: 10px 0;">
  {{/event_image}}
</div>

<p>
  <a href="{{event_link}}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
    View Event Details
  </a>
</p>

<hr style="margin: 30px 0;">
<p style="font-size: 12px; color: #666;">
  You received this email because you subscribed to Sportograf newsletter.
  <a href="{{unsubscribe_link}}">Unsubscribe</a>
</p>
```

#### D. Get API Keys
1. Go to "Account" → "API Keys"
2. Copy your **Public Key**
3. Add to your `.env.local` file

### 2. Environment Variables

Create a `.env.local` file in your project root:

```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_sportograf
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
NEXT_PUBLIC_EMAILJS_NEWSLETTER_TEMPLATE_ID=template_newsletter

# Application Configuration
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Firebase Configuration (already configured)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Firebase Firestore Rules

Add these rules to your Firestore to secure the newsletter collection:

```javascript
// Add to your firestore.rules
match /newsletter_subscribers/{email} {
  allow read, write: if request.auth != null;
  allow read: if resource.data.email == request.auth.token.email;
}
```

### 4. Google Console Setup (Optional - for Google Services)

If you want to use Google services for additional features:

#### A. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable required APIs:
   - Gmail API (for email sending)
   - Google Translate API (for translations)

#### B. Create Service Account
1. Go to "IAM & Admin" → "Service Accounts"
2. Click "Create Service Account"
3. Fill in details and create
4. Download the JSON key file
5. Add path to `.env.local`:
```env
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
```

#### C. Enable APIs
1. Go to "APIs & Services" → "Library"
2. Search and enable:
   - Gmail API
   - Google Translate API
3. Create API keys if needed

### 5. Testing the Newsletter System

#### A. Test Subscription
1. Go to `/newsletter` page
2. Enter an email address
3. Check Firebase Firestore for new subscriber
4. Verify subscription status updates

#### B. Test Event Notifications
1. Create a new event in admin panel
2. Check that newsletter subscribers receive emails
3. Verify unsubscribe links work

#### C. Test Login Integration
1. Go to `/login` page
2. Check newsletter subscription checkbox
3. Complete login process
4. Verify subscription was created

## API Endpoints

The following API endpoints are available:

- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `GET /api/newsletter/subscribe?email=...` - Check subscription status
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter
- `GET /api/newsletter/unsubscribe?email=...` - Unsubscribe via email link
- `POST /api/newsletter/notify` - Send event notifications (admin only)
- `GET /api/newsletter/notify` - Get subscription statistics

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check EmailJS service configuration
   - Verify API keys in environment variables
   - Check EmailJS dashboard for error logs

2. **Subscription not working**
   - Check Firebase Firestore rules
   - Verify Firebase configuration
   - Check browser console for errors

3. **Unsubscribe links not working**
   - Verify `NEXT_PUBLIC_BASE_URL` is correct
   - Check API route is accessible
   - Test unsubscribe page manually

### Debug Mode

Add this to your component to debug subscription status:

```javascript
console.log('Subscription status:', {
  email,
  isSubscribed,
  checkingStatus,
  error
});
```

## Security Considerations

1. **Email Validation**: All email addresses are validated before processing
2. **Rate Limiting**: Consider adding rate limiting to API endpoints
3. **Spam Protection**: EmailJS has built-in spam protection
4. **Data Privacy**: Subscribers can unsubscribe at any time
5. **Firestore Security**: Rules prevent unauthorized access

## Monitoring

Monitor your newsletter system:

1. **EmailJS Dashboard**: Track email delivery rates
2. **Firebase Console**: Monitor subscriber count
3. **Application Logs**: Check for API errors
4. **User Feedback**: Monitor unsubscribe rates

## Support

For issues with:
- **EmailJS**: Check [EmailJS Documentation](https://www.emailjs.com/docs/)
- **Firebase**: Check [Firebase Documentation](https://firebase.google.com/docs)
- **Google Cloud**: Check [Google Cloud Documentation](https://cloud.google.com/docs)

The newsletter system is now fully integrated and ready for production use! 