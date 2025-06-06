import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { doc, getDoc, getDocs, orderBy, query, collection, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Event, EventType } from "@/lib/types";
import type { UserData } from "@/contexts/user-context";
import { getCountries } from "@/lib/countries";

interface UseEventFormProps {
  eventId?: string;
}

interface PhotographerData extends UserData {
  id: string;
}

export function useEventForm({ eventId }: UseEventFormProps) {
  const router = useRouter();
  const isEditing = !!eventId;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [photographers, setPhotographers] = useState<PhotographerData[]>([]);
  const [countries] = useState(getCountries());

  const [formData, setFormData] = useState<Partial<Event>>({
    title: "",
    description: "",
    date: "",
    endDate: "",
    time: "",
    location: "",
    country: "",
    eventTypeId: "",
    tags: [],
    noteToPhotographer: "",
    url: "",
    photographerIds: [],
    geoSnapshotEmbed: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [bestOfImageFiles, setBestOfImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bestOfImagePreviews, setBestOfImagePreviews] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedEndDate, setSelectedEndDate] = useState<Date>();
  const [tagInput, setTagInput] = useState("");
  
  // Store original data for change detection
  const [originalData, setOriginalData] = useState<Partial<Event>>({});
  
  // Email sending options
  const [sendConfirmationEmail, setSendConfirmationEmail] = useState(true);
  const [sendNewsletterNotification, setSendNewsletterNotification] = useState(true);
  const [sendUpdateNotification, setSendUpdateNotification] = useState(true);

  // Fetch event data if editing
  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId) return;

      setLoading(true);
      try {
        const eventDoc = await getDoc(doc(db, "events", eventId));
        if (eventDoc.exists()) {
          const eventData = eventDoc.data() as Event;
          const formDataObject = {
            title: eventData.title || "",
            description: eventData.description || "",
            date: eventData.date || "",
            endDate: eventData.endDate || "",
            time: eventData.time || "",
            location: eventData.location || "",
            country: eventData.country || "",
            eventTypeId: eventData.eventTypeId || "",
            tags: eventData.tags || [],
            noteToPhotographer: eventData.noteToPhotographer || "",
            url: eventData.url || "",
            photographerIds: eventData.photographerIds || [],
            imageUrl: eventData.imageUrl || "",
            bestOfImageUrls: eventData.bestOfImageUrls || [],
            geoSnapshotEmbed: eventData.geoSnapshotEmbed || "",
          };
          
          setFormData(formDataObject);
          setOriginalData(formDataObject);

          if (eventData.imageUrl) {
            setImagePreview(eventData.imageUrl);
          }

          if (eventData.bestOfImageUrls?.length) {
            setBestOfImagePreviews(eventData.bestOfImageUrls);
          }

          if (eventData.date) {
            setSelectedDate(new Date(eventData.date));
          }

          if (eventData.endDate) {
            setSelectedEndDate(new Date(eventData.endDate));
          }
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setError("Failed to load event data");
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  // Fetch event types and photographers
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch event types
        const eventTypesQuery = query(
          collection(db, "eventTypes"),
          orderBy("name")
        );
        const eventTypesSnapshot = await getDocs(eventTypesQuery);
        const eventTypesList = eventTypesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as EventType[];
        setEventTypes(eventTypesList);

        // Fetch photographers from users with photographer role
        const photographersQuery = query(
          collection(db, "users"),
          where("role", "==", "photographer"),
          orderBy("name")
        );
        const photographersSnapshot = await getDocs(photographersQuery);
        const photographersList = photographersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as PhotographerData[];
        setPhotographers(photographersList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Event handlers
  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleDescriptionChange = useCallback((value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  }, []);

  const handleDateSelect = useCallback((date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData((prev) => ({ ...prev, date: format(date, "yyyy-MM-dd") }));
    }
  }, []);

  const handleEndDateSelect = useCallback((date: Date | undefined) => {
    setSelectedEndDate(date);
    if (date) {
      setFormData((prev) => ({ ...prev, endDate: format(date, "yyyy-MM-dd") }));
    }
  }, []);

  const handleImageChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "bestOfImage"
  ) => {
    if (e.target.files && e.target.files[0]) {
      const files = Array.from(e.target.files);
      if (type === "image") {
        const file = files[0];
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        setBestOfImageFiles((prev) => [...prev, ...files]);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setBestOfImagePreviews((prev) => [...prev, ...newPreviews]);
      }
    }
  }, []);

  const handlePhotographerToggle = useCallback((
    photographerId: string,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      photographerIds: checked
        ? [...(prev.photographerIds || []), photographerId]
        : (prev.photographerIds || []).filter((id) => id !== photographerId),
    }));
  }, []);

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  }, [tagInput, formData.tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((tag) => tag !== tagToRemove),
    }));
  }, []);

  const handleRemoveBestOfImage = useCallback((index: number) => {
    setBestOfImageFiles((prev) => prev.filter((_, i) => i !== index));
    setBestOfImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      bestOfImageUrls:
        prev.bestOfImageUrls?.filter((_, i) => i !== index) || [],
    }));
  }, []);

  // Function to detect what changed
  const detectChanges = useCallback((): string[] => {
    const changes: string[] = [];
    
    if (originalData.title !== formData.title) {
      changes.push(`Title changed to "${formData.title}"`);
    }
    
    if (originalData.date !== formData.date) {
      changes.push(`Date changed to ${formData.date}`);
    }
    
    if (originalData.endDate !== formData.endDate) {
      changes.push(`End date updated`);
    }
    
    if (originalData.time !== formData.time) {
      changes.push(`Time updated to ${formData.time}`);
    }
    
    if (originalData.location !== formData.location) {
      changes.push(`Location changed to "${formData.location}"`);
    }
    
    if (originalData.country !== formData.country) {
      const country = countries.find(c => c.code === formData.country);
      changes.push(`Country changed to ${country?.name || formData.country}`);
    }
    
    if (originalData.eventTypeId !== formData.eventTypeId) {
      const eventType = eventTypes.find(et => et.id === formData.eventTypeId);
      changes.push(`Event type changed to "${eventType?.name || 'Unknown'}"`);
    }
    
    if (originalData.description !== formData.description) {
      changes.push(`Description updated`);
    }
    
    if (originalData.noteToPhotographer !== formData.noteToPhotographer) {
      changes.push(`Notes to photographer updated`);
    }
    
    if (originalData.url !== formData.url) {
      changes.push(`Event URL updated`);
    }
    
    // Check if tags changed
    const originalTags = originalData.tags || [];
    const currentTags = formData.tags || [];
    if (JSON.stringify(originalTags.sort()) !== JSON.stringify(currentTags.sort())) {
      changes.push(`Event tags updated`);
    }
    
    // Check if photographers changed
    const originalPhotographers = originalData.photographerIds || [];
    const currentPhotographers = formData.photographerIds || [];
    if (JSON.stringify(originalPhotographers.sort()) !== JSON.stringify(currentPhotographers.sort())) {
      changes.push(`Assigned photographers updated`);
    }
    
    // Check if images changed
    if (imageFile) {
      changes.push(`Event image updated`);
    }
    
    if (bestOfImageFiles.length > 0) {
      changes.push(`Best of images updated`);
    }
    
    if (originalData.geoSnapshotEmbed !== formData.geoSnapshotEmbed) {
      changes.push(`Map embed updated`);
    }
    
    return changes.length > 0 ? changes : ["Event details have been updated"];
  }, [originalData, formData, countries, eventTypes, imageFile, bestOfImageFiles]);

  // Memoized options for better performance
  const photographerOptions = useMemo(() => 
    photographers.map((photographer) => ({
      id: photographer.id,
      name: photographer.name,
      checked: formData.photographerIds?.includes(photographer.id) || false
    })), [photographers, formData.photographerIds]);

  const eventTypeOptions = useMemo(() => 
    eventTypes.map((eventType) => ({
      ...eventType,
      isSelected: formData.eventTypeId === eventType.id
    })), [eventTypes, formData.eventTypeId]);

  return {
    // State
    loading,
    saving,
    setSaving,
    error,
    setError,
    isEditing,
    eventTypes,
    photographers,
    countries,
    formData,
    imageFile,
    bestOfImageFiles,
    imagePreview,
    bestOfImagePreviews,
    selectedDate,
    selectedEndDate,
    tagInput,
    setTagInput,
    sendConfirmationEmail,
    setSendConfirmationEmail,
    sendNewsletterNotification,
    setSendNewsletterNotification,
    sendUpdateNotification,
    setSendUpdateNotification,
    
    // Handlers
    handleInputChange,
    handleSelectChange,
    handleDescriptionChange,
    handleDateSelect,
    handleEndDateSelect,
    handleImageChange,
    handlePhotographerToggle,
    handleAddTag,
    handleRemoveTag,
    handleRemoveBestOfImage,
    detectChanges,
    
    // Memoized options
    photographerOptions,
    eventTypeOptions,
    
    // Navigation
    router,
  };
} 