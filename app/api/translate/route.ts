import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage } = await request.json()

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      )
    }

    // Use google-translate-api-x with proxy support
    const { translate } = await import('google-translate-api-x')
    
    const result = await translate(text, {
      from: 'en',
      to: targetLanguage,
      requestOptions: {
        // Add headers to avoid detection
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        }
      }
    })

    // Handle the result properly - it could be a single result or array
    const translatedText = Array.isArray(result) ? result[0]?.text : result.text

    return NextResponse.json({
      translatedText: translatedText || text,
      originalText: text,
      targetLanguage
    })

  } catch (error) {
    console.error('Translation API error:', error)
    
    // Return original text as fallback
    const requestBody = await request.json().catch(() => ({ text: '' }))
    return NextResponse.json({
      translatedText: requestBody.text || '',
      originalText: requestBody.text || '',
      targetLanguage: 'en',
      error: 'Translation failed, using original text'
    })
  }
} 