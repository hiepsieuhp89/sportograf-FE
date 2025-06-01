export interface Event {
  id: string
  title: string
  description: string
  date: string
  endDate?: string
  time: string
  location: string
  country: string
  eventTypeId: string
  tags: string[]
  noteToPhotographer: string
  url: string
  photographerIds: string[]
  imageUrl?: string
  bestOfImageUrls?: string[]
  geoSnapshotEmbed?: string
  photographerConfirmations?: Record<string, boolean>
  createdAt?: string
  updatedAt?: string
}

export interface EventType {
  id: string
  name: string
  description?: string
  color?: string
  createdAt?: any
  updatedAt?: any
}

export interface Photographer {
  id: string
  name: string
  email: string
  profileImageUrl?: string
  bio?: string
}

export interface User {
  uid: string
  email: string
  role: "admin" | "photographer" | "user"
  photographerId?: string
}

export interface Subevent {
  id: string
  eventId: string
  title: string
  date: string
  imageUrl: string
}

export interface Offer {
  id: string
  title: string
  price: number
  description: string
}

export type Language = "en" | "de" | "fr" | "es"

export interface BannerImage {
  id: string
  title: string
  imageUrl: string
  order: number
  type: "center" | "parallax"
  startScroll?: number
  endScroll?: number
}

export interface FAQ {
  id: string
  title: string
  question: string
  answer?: string
  category: string
  status: "pending" | "approved" | "rejected"
  submittedBy?: string
  submitterEmail?: string
  submitterName?: string
  answeredBy?: string
  translations?: {
    [key in Language]?: {
      title: string
      question: string
      answer?: string
    }
  }
  relatedFAQs?: string[]
  createdAt: string
  updatedAt: string
  approvedAt?: string
}

export interface FAQCategory {
  id: string
  name: string
  description?: string
  count: number
  translations?: {
    [key in Language]?: {
      name: string
      description?: string
    }
  }
  createdAt: string
  updatedAt: string
}
