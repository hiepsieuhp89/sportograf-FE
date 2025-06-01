import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp,
  getDoc
} from 'firebase/firestore'
import { db } from './firebase'
import type { FAQ, Language } from './types'
import { translateFAQContent } from './translation-utils'

// Mock FAQ data for initial setup
const mockFAQData: Omit<FAQ, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: "Who is Sportograf?",
    question: "Who is Sportograf?",
    answer: "Sportograf is the world's leading digital sports photography service. We specialize in capturing and delivering high-quality photos of athletes during sporting events. Our photographers are positioned strategically throughout race courses to capture multiple shots of each participant.",
    category: "Getting started",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },
  {
    title: "What is a Foto-Flat?",
    question: "What is a Foto-Flat?",
    answer: "A Foto-Flat is our photo package that includes all photos of you from an event. Instead of buying individual photos, you get access to all your photos from the event for one flat rate. This includes high-resolution downloads and print-ready files.",
    category: "Getting started",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },
  {
    title: "What is a Magic Link?",
    question: "What is a Magic Link?",
    answer: "A Magic Link is a secure, one-time login link that we send to your email address. Instead of using a traditional password, you simply click the link in your email to access your photos. This provides enhanced security and convenience.",
    category: "Login",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },
  {
    title: "What payment methods are available?",
    question: "What payment methods are available?",
    answer: "Depending on the venue of the event we offer the following payment methods: Bank Transfer, Paypal, Alipay, Visa, Mastercard, GiroPay, Sofortüberweisung, Klarna, Ideal, Postepay.",
    category: "Payment",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },
  {
    title: "How do I order my Foto-Flat?",
    question: "How do I order my Foto-Flat?",
    answer: "To order your Foto-Flat, first find your photos using our search function or facial recognition. Once you've identified your photos, click on 'Order Foto-Flat' and follow the checkout process. You can pay using various payment methods including credit card, PayPal, or bank transfer.",
    category: "Order",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  }
]

export async function initializeFAQs(): Promise<void> {
  try {
    // Check if FAQs already exist
    const faqsQuery = query(collection(db, "faqs"))
    const faqsSnapshot = await getDocs(faqsQuery)
    
    if (faqsSnapshot.empty) {
      console.log("No FAQs found, initializing with mock data...")
      
      // Add mock FAQs
      for (const faqData of mockFAQData) {
        // Generate translations for each FAQ
        const translations = await translateFAQContent(
          faqData.title,
          faqData.question,
          faqData.answer || '',
          'en'
        )
        
        await addDoc(collection(db, "faqs"), {
          ...faqData,
          translations,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      }
      
      console.log("Mock FAQs initialized successfully")
    }
  } catch (error) {
    console.error("Error initializing FAQs:", error)
  }
}

export async function submitFAQ(faqData: {
  title: string
  question: string
  category: string
  submitterEmail?: string
  submitterName?: string
}): Promise<string> {
  try {
    // Generate translations
    const translations = await translateFAQContent(
      faqData.title,
      faqData.question,
      '',
      'en'
    )
    
    const docRef = await addDoc(collection(db, "faqs"), {
      ...faqData,
      status: "pending" as const,
      translations,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    
    return docRef.id
  } catch (error) {
    console.error("Error submitting FAQ:", error)
    throw error
  }
}

export async function getFAQs(status?: FAQ['status']): Promise<FAQ[]> {
  try {
    let faqsQuery = query(collection(db, "faqs"), orderBy("createdAt", "desc"))
    
    if (status) {
      faqsQuery = query(
        collection(db, "faqs"), 
        where("status", "==", status),
        orderBy("createdAt", "desc")
      )
    }
    
    const faqsSnapshot = await getDocs(faqsQuery)
    return faqsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FAQ[]
  } catch (error) {
    console.error("Error fetching FAQs:", error)
    return []
  }
}

export async function getApprovedFAQs(): Promise<FAQ[]> {
  return getFAQs("approved")
}

export async function getPendingFAQs(): Promise<FAQ[]> {
  return getFAQs("pending")
}

export async function getFAQById(id: string): Promise<FAQ | null> {
  try {
    const faqDoc = await getDoc(doc(db, "faqs", id))
    if (faqDoc.exists()) {
      return {
        id: faqDoc.id,
        ...faqDoc.data()
      } as FAQ
    }
    return null
  } catch (error) {
    console.error("Error fetching FAQ:", error)
    return null
  }
}

export async function updateFAQStatus(
  id: string, 
  status: FAQ['status'], 
  answeredBy?: string
): Promise<void> {
  try {
    const updateData: any = {
      status,
      updatedAt: serverTimestamp()
    }
    
    if (status === "approved") {
      updateData.approvedAt = serverTimestamp()
    }
    
    if (answeredBy) {
      updateData.answeredBy = answeredBy
    }
    
    await updateDoc(doc(db, "faqs", id), updateData)
  } catch (error) {
    console.error("Error updating FAQ status:", error)
    throw error
  }
}

export async function updateFAQAnswer(
  id: string, 
  answer: string, 
  answeredBy: string
): Promise<void> {
  try {
    // Get current FAQ to update translations
    const faq = await getFAQById(id)
    if (!faq) throw new Error("FAQ not found")
    
    // Generate translations for the answer
    const updatedTranslations = { ...faq.translations }
    
    // Update translations with new answer
    for (const lang of ['en', 'de', 'fr', 'es'] as Language[]) {
      if (updatedTranslations[lang]) {
        updatedTranslations[lang].answer = answer // For now, use same answer for all languages
      }
    }
    
    await updateDoc(doc(db, "faqs", id), {
      answer,
      answeredBy,
      translations: updatedTranslations,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error("Error updating FAQ answer:", error)
    throw error
  }
}

export async function deleteFAQ(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "faqs", id))
  } catch (error) {
    console.error("Error deleting FAQ:", error)
    throw error
  }
}

export function groupFAQsByCategory(faqs: FAQ[]): { [category: string]: FAQ[] } {
  return faqs.reduce((groups, faq) => {
    const category = faq.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(faq)
    return groups
  }, {} as { [category: string]: FAQ[] })
} 