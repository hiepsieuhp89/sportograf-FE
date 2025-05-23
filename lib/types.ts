export interface Event {
  id: string
  title: string
  description: string
  imageUrl: string
  bestOfImageUrl: string
  date: string
  time: string
  location: string
  url?: string
  photographerIds: string[]
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
  role: "admin" | "photographer"
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
