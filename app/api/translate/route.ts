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

    // Use a simple fetch-based approach to Google Translate
    const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`
    
    const response = await fetch(translateUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    })

    if (!response.ok) {
      throw new Error(`Google Translate API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Google Translate returns an array structure: [[[translated_text, original_text, null, null, 0]], null, "en"]
    let translatedText = text // fallback
    
    if (data && Array.isArray(data) && data[0] && Array.isArray(data[0])) {
      translatedText = data[0].map((item: any) => item[0]).join('')
    }

    return NextResponse.json({
      translatedText,
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