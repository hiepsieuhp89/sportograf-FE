"use client";

import { memo, useMemo } from "react";
import { Info, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { EventType } from "@/lib/types";

interface BasicInfoTabProps {
  formData: {
    title?: string;
    eventTypeId?: string;
    description?: string;
    time?: string;
  };
  eventTypeOptions: (EventType & { isSelected: boolean })[];
  selectedDate?: Date;
  selectedEndDate?: Date;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDateSelect: (date: Date | undefined) => void;
  onEndDateSelect: (date: Date | undefined) => void;
}

// Memoized RichTextEditor to prevent unnecessary re-renders
const MemoizedRichTextEditor = memo(({ value, onChange, placeholder, className }: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className: string;
}) => (
  <RichTextEditor
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={className}
  />
));

MemoizedRichTextEditor.displayName = "MemoizedRichTextEditor";

export const BasicInfoTab = memo(({
  formData,
  eventTypeOptions,
  selectedDate,
  selectedEndDate,
  onInputChange,
  onSelectChange,
  onDescriptionChange,
  onDateSelect,
  onEndDateSelect,
}: BasicInfoTabProps) => {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Info className="h-5 w-5" />
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              onChange={onInputChange}
              placeholder="Enter event title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventTypeId">
              Event Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.eventTypeId}
              onValueChange={(value) => onSelectChange("eventTypeId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypeOptions.map((eventType) => (
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
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <MemoizedRichTextEditor
            value={formData.description || ""}
            onChange={onDescriptionChange}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  onSelect={onDateSelect}
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
                  onSelect={onEndDateSelect}
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
              onChange={onInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

BasicInfoTab.displayName = "BasicInfoTab"; 