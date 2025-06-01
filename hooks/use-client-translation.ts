import { useState, useEffect } from 'react'
import { translateText } from '@/lib/translation-utils'
import type { Language } from '@/lib/types'

interface TranslatedContent {
  title: string
  question: string
  answer: string
}

export function useClientTranslation(
  originalTitle: string,
  originalQuestion: string,
  originalAnswer: string,
  targetLanguage: Language
) {
  const [translatedContent, setTranslatedContent] = useState<TranslatedContent>({
    title: originalTitle,
    question: originalQuestion,
    answer: originalAnswer
  })
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationCache, setTranslationCache] = useState<Map<string, TranslatedContent>>(new Map())

  useEffect(() => {
    // If target language is English, use original content
    if (targetLanguage === 'en') {
      setTranslatedContent({
        title: originalTitle,
        question: originalQuestion,
        answer: originalAnswer
      })
      return
    }

    // Create cache key
    const cacheKey = `${targetLanguage}-${originalTitle}-${originalQuestion}-${originalAnswer}`
    
    // Check if translation is already cached
    if (translationCache.has(cacheKey)) {
      setTranslatedContent(translationCache.get(cacheKey)!)
      return
    }

    // Translate content
    const translateContent = async () => {
      setIsTranslating(true)
      try {
        const [translatedTitle, translatedQuestion, translatedAnswer] = await Promise.all([
          translateText(originalTitle, targetLanguage),
          translateText(originalQuestion, targetLanguage),
          originalAnswer ? translateText(originalAnswer, targetLanguage) : ''
        ])

        const translated = {
          title: translatedTitle,
          question: translatedQuestion,
          answer: translatedAnswer
        }

        setTranslatedContent(translated)
        
        // Cache the translation
        setTranslationCache(prev => new Map(prev).set(cacheKey, translated))
      } catch (error) {
        console.error('Translation error:', error)
        // Fallback to original content
        setTranslatedContent({
          title: originalTitle,
          question: originalQuestion,
          answer: originalAnswer
        })
      } finally {
        setIsTranslating(false)
      }
    }

    translateContent()
  }, [originalTitle, originalQuestion, originalAnswer, targetLanguage, translationCache])

  return {
    translatedContent,
    isTranslating
  }
} 