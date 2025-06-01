import type { Language } from './types'

// Translation function using Next.js API route
export async function translateText(text: string, targetLanguage: Language): Promise<string> {
  if (targetLanguage === 'en') {
    return text // No translation needed for English
  }
  
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        targetLanguage
      })
    })

    if (!response.ok) {
      throw new Error(`Translation API error: ${response}`)
    }

    const data = await response.json()
    
    if (data.error) {
      console.warn('Translation warning:', data.error)
    }
    
    return data.translatedText || text
  } catch (error) {
    console.error(`Translation error for ${targetLanguage}:`, error)
    // Fallback to original text if translation fails
    return text
  }
}

export async function translateFAQContent(
  title: string,
  question: string,
  answer: string = '',
  sourceLanguage: Language = 'en'
): Promise<{
  [key in Language]: {
    title: string
    question: string
    answer: string
  }
}> {
  const translations: any = {}
  
  // Add source language
  translations[sourceLanguage] = {
    title,
    question,
    answer
  }
  
  // Translate to other languages
  const targetLanguages = (['en', 'de', 'fr', 'es'] as Language[]).filter(lang => lang !== sourceLanguage)
  
  for (const lang of targetLanguages) {
    try {
      const [translatedTitle, translatedQuestion, translatedAnswer] = await Promise.all([
        translateText(title, lang),
        translateText(question, lang),
        answer ? translateText(answer, lang) : ''
      ])
      
      translations[lang] = {
        title: translatedTitle,
        question: translatedQuestion,
        answer: translatedAnswer
      }
    } catch (error) {
      console.error(`Error translating to ${lang}:`, error)
      // Fallback to original content
      translations[lang] = {
        title,
        question,
        answer
      }
    }
  }
  
  return translations
}

export function getTranslatedContent(
  translations: any,
  currentLanguage: Language,
  fallbackLanguage: Language = 'en'
) {
  return translations?.[currentLanguage] || translations?.[fallbackLanguage] || null
} 