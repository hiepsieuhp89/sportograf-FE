import { create } from 'zustand'
import type { Event } from './types'

interface EventStore {
  events: Event[]
  selectedEvent: Event | null
  setEvents: (events: Event[]) => void
  setSelectedEvent: (event: Event | null) => void
  getEventById: (id: string) => Event | undefined
}

export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  selectedEvent: null,
  setEvents: (events) => set({ events }),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  getEventById: (id) => get().events.find(event => event.id === id),
})) 