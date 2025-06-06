"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smartphone, Tablet, Monitor } from "lucide-react";
import { EventDetail } from "@/components/event-detail";
import type { Event } from "@/lib/types";
import { useEventForm } from "./event-form/hooks/use-event-form";
import { BasicInfoTab } from "./event-form/basic-info-tab";
import { ContentMediaTab } from "./event-form/content-media-tab";
import { TeamLocationTab } from "./event-form/team-location-tab";
import { SettingsTab } from "./event-form/settings-tab";
import { submitEvent } from "./event-form/event-submission";

interface EnhancedEventFormProps {
  eventId?: string;
}

type PreviewViewport = 'mobile' | 'tablet' | 'desktop';

export function EnhancedEventForm({ eventId }: EnhancedEventFormProps) {
  const {
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
  } = useEventForm({ eventId });

  const [showPreview, setShowPreview] = useState(false);
  const [previewViewport, setPreviewViewport] = useState<PreviewViewport>('desktop');

  // Handle location change with auto country detection
  const handleLocationChange = (location: string, country?: string) => {
    const updateData: Partial<typeof formData> = { location };
    if (country) {
      updateData.country = country;
    }
    
    Object.entries(updateData).forEach(([key, value]) => {
      handleSelectChange(key, value as string);
    });
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

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError("");

    try {
      await submitEvent({
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
      });

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

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content & Media</TabsTrigger>
              <TabsTrigger value="team">Team & Location</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6 mt-6">
              <BasicInfoTab
                formData={formData}
                eventTypeOptions={eventTypeOptions}
                selectedDate={selectedDate}
                selectedEndDate={selectedEndDate}
                onInputChange={handleInputChange}
                onSelectChange={handleSelectChange}
                onDescriptionChange={handleDescriptionChange}
                onDateSelect={handleDateSelect}
                onEndDateSelect={handleEndDateSelect}
              />
            </TabsContent>

            <TabsContent value="content" className="space-y-6 mt-6">
              <ContentMediaTab
                formData={formData}
                imagePreview={imagePreview}
                bestOfImagePreviews={bestOfImagePreviews}
                tagInput={tagInput}
                onTagInputChange={setTagInput}
                onImageChange={handleImageChange}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
                onRemoveBestOfImage={handleRemoveBestOfImage}
              />
            </TabsContent>

            <TabsContent value="team" className="space-y-6 mt-6">
              <TeamLocationTab
                formData={formData}
                countries={countries}
                photographerOptions={photographerOptions}
                onInputChange={handleInputChange}
                onSelectChange={handleSelectChange}
                onPhotographerToggle={handlePhotographerToggle}
                onLocationChange={handleLocationChange}
              />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6 mt-6">
              <SettingsTab
                formData={formData}
                isEditing={isEditing}
                sendConfirmationEmail={sendConfirmationEmail}
                sendNewsletterNotification={sendNewsletterNotification}
                sendUpdateNotification={sendUpdateNotification}
                onInputChange={handleInputChange}
                onConfirmationEmailChange={setSendConfirmationEmail}
                onNewsletterNotificationChange={setSendNewsletterNotification}
                onUpdateNotificationChange={setSendUpdateNotification}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4 mt-8">
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