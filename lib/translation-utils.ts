import type { Language } from './types'

// Google Translate API integration
async function translateWithGoogle(text: string, targetLanguage: Language): Promise<string> {
  try {
    // Dynamic import to avoid build issues
    const { translate } = await import('google-translate-api-x')
    
    // Map our language codes to Google Translate codes
    const languageMap: Record<Language, string> = {
      'en': 'en',
      'de': 'de', 
      'fr': 'fr',
      'es': 'es'
    }
    
    const result = await translate(text, { 
      from: 'en', 
      to: languageMap[targetLanguage] 
    })
    
    return result.text
  } catch (error) {
    console.error(`Translation error for ${targetLanguage}:`, error)
    // Fallback to original text if translation fails
    return text
  }
}

// Translation function with Google Translate API
export async function translateText(text: string, targetLanguage: Language): Promise<string> {
  if (targetLanguage === 'en') {
    return text // No translation needed for English
  }
  
  return await translateWithGoogle(text, targetLanguage)
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