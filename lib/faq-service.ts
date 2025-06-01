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
import type { FAQ } from './types'

// Comprehensive mock FAQ data for initial setup
const mockFAQData: Omit<FAQ, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Getting started
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
    title: "How it works",
    question: "How does Sportograf work?",
    answer: "Sportograf works by having professional photographers positioned at strategic points during your sporting event. They capture high-quality photos of all participants. After the event, our advanced facial recognition and number recognition technology helps you find your photos quickly. You can then purchase individual photos or a Foto-Flat containing all your photos.",
    category: "Getting started",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },

  // Login
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
    title: "My validation for an event has failed. What to do?",
    question: "My validation for an event has failed. What to do?",
    answer: "If your event validation has failed, please check that you've entered the correct event details and your registration information. If the problem persists, contact our support team with your event details and registration information, and we'll help you resolve the issue.",
    category: "Login",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },
  {
    title: "How long can I access my photos?",
    question: "How long can I access my photos?",
    answer: "Once you've purchased your photos, you have unlimited access to download them. We recommend downloading your photos as soon as possible and storing them safely. Your download links will remain active, but we suggest not relying solely on our servers for long-term storage.",
    category: "Login",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },
  {
    title: "How does the 2-Factor-Authentication (2FA) work?",
    question: "How does the 2-Factor-Authentication (2FA) work?",
    answer: "Our 2-Factor-Authentication adds an extra layer of security to your account. When enabled, you'll need to provide both your email and a verification code sent to your phone or email. This ensures that only you can access your photos, even if someone else has your email address.",
    category: "Login",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },

  // Find your own photos
  {
    title: "Search by selfie/face recognition",
    question: "How do I search by selfie/face recognition?",
    answer: "Our advanced facial recognition technology allows you to find your photos by uploading a selfie. Simply upload a clear photo of yourself, and our system will automatically identify and show you all photos where you appear in the event.",
    category: "Find your own photos",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },
  {
    title: "How do I find and mark more photos of myself?",
    question: "How do I find and mark more photos of myself?",
    answer: "You can find more photos of yourself by using our facial recognition feature, searching by your race number, or browsing through the event gallery. Once you find additional photos of yourself, you can mark them to add to your collection.",
    category: "Find your own photos",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },
  {
    title: "Why can't I find pictures of myself?",
    question: "Why can't I find pictures of myself?",
    answer: "There could be several reasons: 1) The photos might not be uploaded yet, 2) You might be wearing sunglasses or a hat that affects facial recognition, 3) Your race number might not be visible, 4) You might need to try different search terms. Try using our manual search or contact support for assistance.",
    category: "Find your own photos",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },
  {
    title: "There are one or more photos of strangers in my Foto-Flat",
    question: "There are one or more photos of strangers in my Foto-Flat",
    answer: "If you've found photos of other people in your Foto-Flat, this might be due to similar race numbers or facial recognition errors. Please contact our support team with the specific photo details, and we'll review and correct your Foto-Flat.",
    category: "Find your own photos",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },
  {
    title: "Number of photos in the Foto-Flat",
    question: "How many photos are included in the Foto-Flat?",
    answer: "The number of photos in your Foto-Flat depends on how many photos our photographers captured of you during the event. Typically, this ranges from 10-50+ photos, depending on the event size, duration, and photographer coverage.",
    category: "Find your own photos",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },

  // Order
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
  },
  {
    title: "I pre-ordered my Photo Package before the event",
    question: "I pre-ordered my Photo Package before the event",
    answer: "If you pre-ordered your photo package, you should have received a confirmation email with instructions on how to access your photos after the event. Use the magic link or access code provided in your confirmation email to view and download your photos.",
    category: "Order",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },
  {
    title: "Pre-ordered Photo Package - Spartan",
    question: "How do I access my pre-ordered Spartan photo package?",
    answer: "For Spartan events, use your race confirmation email or bib number to access your pre-ordered photos. If you can't find your access details, contact support with your Spartan registration information.",
    category: "Order",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },
  {
    title: "Pre-ordered Photo Package - HYROX",
    question: "How do I access my pre-ordered HYROX photo package?",
    answer: "For HYROX events, use your race confirmation email or bib number to access your pre-ordered photos. Check your email for the magic link sent after the event, or use your HYROX registration details to search for your photos.",
    category: "Order",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },
  {
    title: "Can I also order single photos?",
    question: "Can I also order single photos?",
    answer: "Yes, you can purchase individual photos instead of the full Foto-Flat. Simply select the specific photos you want and add them to your cart. However, the Foto-Flat usually offers better value if you want multiple photos.",
    category: "Order",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },

  // Payment
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
    title: "I would like to pay by bank transfer. How can I do?",
    question: "I would like to pay by bank transfer. How can I do?",
    answer: "You can pay by bank transfer during the checkout process. Select 'Bank Transfer' as your payment method and you will receive our bank details to complete the payment. Please include your order number in the payment reference.",
    category: "Payment",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },
  {
    title: "I paid twice. What can I do?",
    question: "I paid twice. What can I do?",
    answer: "If you accidentally made a duplicate payment, please contact our support team immediately with your order details and payment confirmation. We'll process a refund for the duplicate payment as quickly as possible.",
    category: "Payment",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },
  {
    title: "Where do I find the invoice for my purchases?",
    question: "Where do I find the invoice for my purchases?",
    answer: "Your invoice is automatically sent to your email address after successful payment. You can also find it in your account under 'My Orders' or 'Purchase History'. If you can't locate it, contact support with your order number.",
    category: "Payment",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },
  {
    title: "Where can I find your bank details?",
    question: "Where can I find your bank details?",
    answer: "Our bank details are provided during the checkout process when you select bank transfer as your payment method. You'll also receive them in your order confirmation email. For security reasons, we don't publish our bank details publicly.",
    category: "Payment",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },

  // Download
  {
    title: "Where is my order?",
    question: "Where is my order?",
    answer: "You can check your order status by logging into your account and visiting the 'My Orders' section. You will also receive email notifications about your order status. Once your photos are ready for download, you'll receive a download link via email.",
    category: "Download",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },
  {
    title: "ZIP download",
    question: "How does the ZIP download work?",
    answer: "Once your order is processed, you'll receive a download link that allows you to download all your photos in a single ZIP file. This makes it easy to get all your photos at once. The ZIP file contains high-resolution versions of all your purchased photos.",
    category: "Download",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },
  {
    title: "Your Download Area",
    question: "How do I access my download area?",
    answer: "Your download area can be accessed through the link in your purchase confirmation email or by logging into your account and going to 'My Downloads'. Here you'll find all your purchased photos available for download.",
    category: "Download",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },

  // FAQ
  {
    title: "I have read the FAQ but did not find an answer to my question",
    question: "I have read the FAQ but did not find an answer to my question",
    answer: "If you couldn't find the answer to your question in our FAQ, please contact our support team directly. You can use our contact form or send an email to support@sportograf.com. We're here to help and will respond as quickly as possible.",
    category: "FAQ",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },

  // Press
  {
    title: "Can I publish photos I have bought on social media?",
    question: "Can I publish photos I have bought on social media?",
    answer: "Yes, you can publish photos you've purchased on your personal social media accounts. However, please ensure you credit Sportograf when sharing. Commercial use or redistribution requires additional licensing - please contact us for commercial usage rights.",
    category: "Press",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },
  {
    title: "Did I acquire the rights to further use with the purchase?",
    question: "Did I acquire the rights to further use with the purchase?",
    answer: "With your purchase, you acquire personal usage rights for the photos. This includes personal social media sharing, printing for personal use, and sharing with family and friends. Commercial usage, redistribution, or resale requires additional licensing agreements.",
    category: "Press",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },

  // Photographer
  {
    title: "How to become a Sportografer?",
    question: "How to become a Sportografer?",
    answer: "To become a Sportograf photographer, you need professional photography experience, especially in sports photography. We look for photographers who can work in challenging conditions and deliver high-quality results. Apply through our careers page with your portfolio and experience details.",
    category: "Photographer",
    status: "approved",
    submittedBy: "system",
    answeredBy: "admin",
    approvedAt: new Date().toISOString(),
    relatedFAQs: []
  },

  // Number - and Face recognition
  {
    title: "How does your recognition work?",
    question: "How does your recognition work?",
    answer: "Our recognition system uses advanced AI technology to identify faces and race numbers in photos. For face recognition, upload a clear selfie and our system will find photos where you appear. For number recognition, we automatically detect race bibs and numbers to help you find your photos quickly.",
    category: "Number - and Face recognition",
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
      console.log("No FAQs found, initializing with comprehensive mock data...")
      
      // Add mock FAQs without translations (client-side translation)
      for (const faqData of mockFAQData) {
        try {
          await addDoc(collection(db, "faqs"), {
            ...faqData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          })
          
          console.log(`Added FAQ: ${faqData.title}`)
        } catch (error) {
          console.error(`Error adding FAQ "${faqData.title}":`, error)
        }
      }
      
      console.log("Comprehensive FAQ mock data initialized successfully")
    } else {
      console.log("FAQs already exist, skipping initialization")
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
    const docRef = await addDoc(collection(db, "faqs"), {
      ...faqData,
      status: "pending" as const,
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
    await updateDoc(doc(db, "faqs", id), {
      answer,
      answeredBy,
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