import { addDoc, collection, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadFile } from "@/lib/upload-utils";
import { 
  sendConfirmationEmails, 
  sendNewsletterNotification as sendNewsletterEmail, 
  sendEventUpdateNotification,
  preparePhotographerEmails 
} from "@/lib/email-client";
import type { Event, Photographer } from "@/lib/types";

interface SubmitEventParams {
  formData: Partial<Event>;
  imageFile: File | null;
  bestOfImageFiles: File[];
  isEditing: boolean;
  eventId?: string;
  sendConfirmationEmail: boolean;
  sendNewsletterNotification: boolean;
  sendUpdateNotification: boolean;
  photographers: Photographer[];
  detectChanges: () => string[];
  uploadedImageUrl?: string;
  uploadedBestOfUrls?: string[];
  onImageUploaded?: (url: string) => void;
  onBestOfUploaded?: (urls: string[]) => void;
}

export async function submitEvent({
  formData,
  imageFile,
  bestOfImageFiles,
  isEditing,
  eventId,
  sendConfirmationEmail,
  sendNewsletterNotification,
  sendUpdateNotification,
  photographers,
  detectChanges,
  uploadedImageUrl,
  uploadedBestOfUrls = [],
  onImageUploaded,
  onBestOfUploaded,
}: SubmitEventParams): Promise<void> {
  let imageUrl = formData.imageUrl;
  let bestOfImageUrls = formData.bestOfImageUrls || [];

  // Upload main image if provided and not already uploaded
  if (imageFile && !uploadedImageUrl) {
    const path = `${Date.now()}_${imageFile.name}`;
    imageUrl = await uploadFile(imageFile, `events/${path}`);
    // Notify parent component about the uploaded URL
    onImageUploaded?.(imageUrl);
  } else if (uploadedImageUrl) {
    // Use already uploaded image URL
    imageUrl = uploadedImageUrl;
  }

  // Upload best of images if provided and not already uploaded
  if (bestOfImageFiles.length > 0) {
    // Filter out files that are already uploaded
    const newFilesToUpload = bestOfImageFiles.filter((_, index) => !uploadedBestOfUrls[index]);
    
    if (newFilesToUpload.length > 0) {
      const uploadPromises = newFilesToUpload.map(async (file) => {
        const path = `best-of/${Date.now()}_${file.name}`;
        return uploadFile(file, `events/${path}`);
      });

      const newBestOfImageUrls = await Promise.all(uploadPromises);
      
      // Combine existing uploaded URLs with new ones
      const allBestOfUrls = [...uploadedBestOfUrls, ...newBestOfImageUrls];
      bestOfImageUrls = [
        ...(formData.bestOfImageUrls || []),
        ...allBestOfUrls,
      ];
      
      // Notify parent component about the uploaded URLs
      onBestOfUploaded?.(allBestOfUrls);
    } else {
      // Use already uploaded URLs
      bestOfImageUrls = [
        ...(formData.bestOfImageUrls || []),
        ...uploadedBestOfUrls,
      ];
    }
  }

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
    await updateDoc(doc(db, "events", eventId!), eventData);
  } else {
    // Create new event
    const docRef = await addDoc(collection(db, "events"), {
      ...eventData,
      createdAt: serverTimestamp(),
    });
    eventDocId = docRef.id;
  }

  // Handle email notifications based on mode
  if (isEditing) {
    // For editing mode: Send update notification if enabled
    if (sendUpdateNotification) {
      try {
        // Detect what actually changed
        const changes = detectChanges();

        await sendEventUpdateNotification({
          eventTitle: formData.title || '',
          eventDate: formData.date || '',
          eventLocation: formData.location || '',
          eventDescription: formData.description || '',
          eventId: eventDocId || "",
          eventImage: imageUrl || '',
          changes: changes
        });
      } catch (updateError) {
        console.warn('Failed to send update notifications:', updateError);
        // Don't fail the event update if email sending fails
      }
    }
  } else {
    // For creating mode: Send confirmation and newsletter emails
    
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

    // Send newsletter notifications for new events if enabled
    if (sendNewsletterNotification) {
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
  }
} 