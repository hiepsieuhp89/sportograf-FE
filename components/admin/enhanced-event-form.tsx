"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getCountries } from "@/lib/countries";
import { 
  sendConfirmationEmails, 
  sendNewsletterNotification as sendNewsletterEmail, 
  preparePhotographerEmails 
} from "@/lib/email-client";
import { EventDetail } from "@/components/event-detail";
import { db } from "@/lib/firebase";
import type { Event, EventType, Photographer } from "@/lib/types";
import { uploadFile } from "@/lib/upload-utils";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Autocomplete from "react-google-autocomplete";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  Calendar,
  FileImage,
  Info,
  MapPin,
  MessageSquare,
  Tag,
  Users,
  Trash2,
  Smartphone,
  Tablet,
  Monitor,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

interface EnhancedEventFormProps {
  eventId?: string;
}

export function EnhancedEventForm({ eventId }: EnhancedEventFormProps) {
  const router = useRouter();
  const isEditing = !!eventId;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
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
  
  // Email sending options
  const [sendConfirmationEmail, setSendConfirmationEmail] = useState(true);
  const [sendNewsletterNotification, setSendNewsletterNotification] = useState(true);
  
  // Preview viewport options
  const [previewViewport, setPreviewViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Fetch event data if editing
  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId) return;

      setLoading(true);
      try {
        const eventDoc = await getDoc(doc(db, "events", eventId));
        if (eventDoc.exists()) {
          const eventData = eventDoc.data() as Event;
          setFormData({
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
          });

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

        // Fetch photographers
        const photographersQuery = query(
          collection(db, "photographers"),
          orderBy("name")
        );
        const photographersSnapshot = await getDocs(photographersQuery);
        const photographersList = photographersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Photographer[];
        setPhotographers(photographersList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData((prev) => ({ ...prev, date: format(date, "yyyy-MM-dd") }));
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    setSelectedEndDate(date);
    if (date) {
      setFormData((prev) => ({ ...prev, endDate: format(date, "yyyy-MM-dd") }));
    }
  };

  const handleImageChange = (
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
  };

  const handlePhotographerToggle = (
    photographerId: string,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      photographerIds: checked
        ? [...(prev.photographerIds || []), photographerId]
        : (prev.photographerIds || []).filter((id) => id !== photographerId),
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((tag) => tag !== tagToRemove),
    }));
  };

  const uploadImage = async (file: File, path: string): Promise<string> => {
    return uploadFile(file, `events/${path}`);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  // Get viewport styles for preview
  const getViewportStyles = () => {
    switch (previewViewport) {
      case 'mobile':
        return {
          width: '375px',
          height: '100%',
          margin: '0 auto',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem'
        };
      case 'tablet':
        return {
          width: '768px',
          height: '100%',
          margin: '0 auto',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem'
        };
      case 'desktop':
        return {
          width: '100%',
          height: '100%'
        };
      default:
        return {
          width: '100%',
          height: '100%'
        };
    }
  };

  // Convert form data to Event object for preview
  const createPreviewEvent = (): Event => {
    return {
      id: eventId || "preview",
      title: formData.title || "",
      description: formData.description || "",
      date: formData.date || "",
      endDate: formData.endDate || "",
      time: formData.time || "",
      location: formData.location || "",
      country: formData.country || "",
      eventTypeId: formData.eventTypeId || "",
      tags: formData.tags || [],
      noteToPhotographer: formData.noteToPhotographer || "",
      url: formData.url || "",
      photographerIds: formData.photographerIds || [],
      imageUrl: imagePreview || formData.imageUrl || "",
      bestOfImageUrls: bestOfImagePreviews.length > 0 ? bestOfImagePreviews : (formData.bestOfImageUrls || []),
      geoSnapshotEmbed: formData.geoSnapshotEmbed || ""
    };
  };

  const handleRemoveBestOfImage = (index: number) => {
    setBestOfImageFiles((prev) => prev.filter((_, i) => i !== index));
    setBestOfImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      bestOfImageUrls:
        prev.bestOfImageUrls?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError("");

    try {
      let imageUrl = formData.imageUrl;
      let bestOfImageUrls = formData.bestOfImageUrls || [];

      // Upload main image if provided
      if (imageFile) {
        const path = `${Date.now()}_${imageFile.name}`;
        imageUrl = await uploadImage(imageFile, path);
      }

      // Upload best of images if provided
      const uploadPromises = bestOfImageFiles.map(async (file) => {
        const path = `best-of/${Date.now()}_${file.name}`;
        return uploadImage(file, path);
      });

      const newBestOfImageUrls = await Promise.all(uploadPromises);
      bestOfImageUrls = [
        ...(formData.bestOfImageUrls || []),
        ...newBestOfImageUrls,
      ];

      const eventData = {
        ...formData,
        imageUrl,
        bestOfImageUrls,
        updatedAt: serverTimestamp(),
      };

      let eventDocId = eventId;
      let photographerEmails: string[] = [];

      if (isEditing) {
        // Update existing event
        await updateDoc(doc(db, "events", eventId), eventData);
      } else {
        // Create new event
        const docRef = await addDoc(collection(db, "events"), {
          ...eventData,
          createdAt: serverTimestamp(),
        });
        eventDocId = docRef.id;
      }

      // Send confirmation emails to photographers if enabled
      if (sendConfirmationEmail && formData.photographerIds && formData.photographerIds.length > 0) {
        try {
          const photographerEmailData = preparePhotographerEmails(formData.photographerIds, photographers);
          
          // Track photographer emails for duplicate prevention
          photographerEmails = photographerEmailData.map(p => p.email);

          if (photographerEmailData.length > 0) {
            await sendConfirmationEmails({
              photographerEmails: photographerEmailData,
              eventData: {
                title: formData.title || "",
                date: formData.date || "",
                location: formData.location || "",
                description: formData.description || "",
                noteToPhotographer: formData.noteToPhotographer,
              },
              eventId: eventDocId!
            });
          }
        } catch (emailError) {
          console.warn('Failed to send confirmation emails:', emailError);
          // Don't fail the event creation if email sending fails
        }
      }

      // Send newsletter notifications for new events if enabled (only for new events)
      if (!isEditing && sendNewsletterNotification) {
        try {
          await sendNewsletterEmail({
            eventTitle: formData.title || '',
            eventDate: formData.date || '',
            eventLocation: formData.location || '',
            eventDescription: formData.description || '',
            eventId: eventDocId || "",
            eventImage: imageUrl || '',
            excludeEmails: photographerEmails // Pass photographer emails to exclude
          });
        } catch (notificationError) {
          console.warn('Failed to send newsletter notifications:', notificationError);
          // Don't fail the event creation if newsletter notification fails
        }
      }

      setShowPreview(false);
      router.push("/admin/events");
    } catch (error) {
      console.error("Error saving event:", error);
      setError("Failed to save event. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mainNavyText"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Event" : "Create Event"}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Basic Information
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter event title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventTypeId">
                    Event Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.eventTypeId}
                    onValueChange={(value) =>
                      handleSelectChange("eventTypeId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((eventType) => (
                        <SelectItem key={eventType.id} value={eventType.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: eventType.color }}
                            />
                            {eventType.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <RichTextEditor
                    value={formData.description || ""}
                    onChange={handleDescriptionChange}
                    placeholder="Enter event description"
                    className="min-h-[200px]"
                  />
                </div>
              </div>

              {/* Date and Time */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Date & Time
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Start Date <span className="text-red-500">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {selectedDate
                            ? format(selectedDate, "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateSelect}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedEndDate && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {selectedEndDate
                            ? format(selectedEndDate, "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={selectedEndDate}
                          onSelect={handleEndDateSelect}
                          initialFocus
                          disabled={(date) =>
                            selectedDate ? date < selectedDate : false
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">
                      Location <span className="text-red-500">*</span>
                    </Label>
                    {/* <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter location"
                      className="w-full"
                    /> */}
                    <Autocomplete
                      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                      onPlaceSelected={(place) => {
                        if (place.formatted_address) {
                          setFormData((prev) => ({
                            ...prev,
                            location: place.formatted_address,
                          }));

                          // Auto-fill country if available
                          const countryComponent =
                            place.address_components?.find((component: any) =>
                              component.types.includes("country")
                            );
                          if (countryComponent) {
                            const countryCode = countryComponent.short_name;
                            const country = countries.find(
                              (c) => c.code === countryCode
                            );
                            if (country) {
                              setFormData((prev) => ({
                                ...prev,
                                country: country.code,
                              }));
                            }
                          }
                        }
                      }}
                      options={{
                        types: ["establishment", "geocode"],
                        componentRestrictions: { country: [] }, // Allow all countries
                      }}
                      defaultValue={formData.location}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        fontSize: "14px",
                        outline: "none",
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainNavyText focus:border-transparent"
                      placeholder="Search for a location..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">
                      Country <span className="text-red-500">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between"
                        >
                          {formData.country
                            ? countries.find(
                                (country) => country.code === formData.country
                              )?.name
                            : "Select country..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search country..." />
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup className="max-h-[300px] overflow-y-auto">
                            {countries.map((country) => (
                              <CommandItem
                                key={country.code}
                                value={country.name}
                                onSelect={() => {
                                  handleSelectChange("country", country.code);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.country === country.code
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {country.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileImage className="h-5 w-5" />
                  Images
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">
                      Event Image <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "image")}
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <Image
                          src={imagePreview}
                          alt="Event preview"
                          width={200}
                          height={150}
                          className="rounded-md object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bestOfImage">
                      Best of Images <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="bestOfImage"
                      name="bestOfImage"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageChange(e, "bestOfImage")}
                    />
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {bestOfImagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={preview}
                            alt={`Best of preview ${index + 1}`}
                            width={200}
                            height={150}
                            className="rounded-md object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => handleRemoveBestOfImage(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags
                </h3>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                    />
                    <Button type="button" onClick={handleAddTag}>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags?.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-red-500"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Photographers */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Assign Photographers
                </h3>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {photographers.map((photographer) => (
                    <div
                      key={photographer.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={photographer.id}
                        checked={formData.photographerIds?.includes(
                          photographer.id
                        )}
                        onCheckedChange={(checked) =>
                          handlePhotographerToggle(
                            photographer.id,
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor={photographer.id} className="flex-1">
                        {photographer.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note to Photographer */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Note to Photographer
                </h3>

                <Textarea
                  name="noteToPhotographer"
                  value={formData.noteToPhotographer}
                  onChange={handleInputChange}
                  placeholder="Add any special instructions or notes for photographers"
                  rows={4}
                />
              </div>

              {/* Geo Snapshot Embed */}
              <div className="space-y-2">
                <Label htmlFor="geoSnapshotEmbed">
                  Geo Snapshot Embed Code
                </Label>
                <Textarea
                  id="geoSnapshotEmbed"
                  name="geoSnapshotEmbed"
                  value={formData.geoSnapshotEmbed}
                  onChange={handleInputChange}
                  placeholder="Paste your Geo Snapshot embed code here"
                  rows={4}
                />
              </div>

              {/* Event URL */}
              <div className="space-y-2">
                <Label htmlFor="url">Event URL</Label>
                <Input
                  id="url"
                  name="url"
                  type="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Email Options */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              📧 Email Options
            </h3>
            
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sendConfirmationEmail"
                  checked={sendConfirmationEmail}
                  onCheckedChange={(checked) => setSendConfirmationEmail(checked as boolean)}
                />
                <Label htmlFor="sendConfirmationEmail" className="font-medium">
                  Send confirmation email to assigned photographers
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sendNewsletterNotification"
                  checked={sendNewsletterNotification}
                  onCheckedChange={(checked) => setSendNewsletterNotification(checked as boolean)}
                />
                <Label htmlFor="sendNewsletterNotification" className="font-medium">
                  Send new event notification to newsletter subscribers
                </Label>
              </div>
              
              <p className="text-sm text-gray-600">
                💡 Note: If a photographer is also a newsletter subscriber, they will only receive the confirmation email.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/events")}
            >
              Cancel
            </Button>
            <Button type="button" variant="outline" onClick={handlePreview}>
              Preview
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving..." : "Save Event"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Event Preview</DialogTitle>
                <DialogDescription>
                  Review your event details before saving
                </DialogDescription>
              </div>
              
              {/* Viewport Controls */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={previewViewport === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewViewport('mobile')}
                  className="h-8 px-3"
                >
                  <Smartphone className="h-4 w-4 mr-1" />
                  Mobile
                </Button>
                <Button
                  variant={previewViewport === 'tablet' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewViewport('tablet')}
                  className="h-8 px-3"
                >
                  <Tablet className="h-4 w-4 mr-1" />
                  Tablet
                </Button>
                <Button
                  variant={previewViewport === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setPreviewViewport('desktop')}
                  className="h-8 px-3"
                >
                  <Monitor className="h-4 w-4 mr-1" />
                  Desktop
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Preview Content with EventDetail component */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)] bg-gray-50">
            <div style={getViewportStyles()}>
              <EventDetail event={createPreviewEvent()} />
            </div>
          </div>

          <DialogFooter className="p-6 pt-0 border-t bg-white">
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-gray-500">
                Current viewport: <span className="font-medium capitalize">{previewViewport}</span>
                {previewViewport !== 'desktop' && (
                  <span className="ml-2">
                    ({previewViewport === 'mobile' ? '375px' : '768px'} width)
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Edit More
                </Button>
                <Button onClick={handleSubmit} disabled={saving}>
                  {saving ? "Saving..." : "Confirm & Save Event"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
