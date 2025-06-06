"use client";

import { memo } from "react";
import { MapPin, Users, MessageSquare, Check, ChevronsUpDown } from "lucide-react";
import Autocomplete from "react-google-autocomplete";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import type { Country } from "@/lib/countries";

interface TeamLocationTabProps {
  formData: {
    location?: string;
    country?: string;
    noteToPhotographer?: string;
  };
  countries: Country[];
  photographerOptions: { id: string; name: string; checked: boolean }[];
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onPhotographerToggle: (photographerId: string, checked: boolean) => void;
  onLocationChange: (location: string, country?: string) => void;
}

export const TeamLocationTab = memo(({
  formData,
  countries,
  photographerOptions,
  onInputChange,
  onSelectChange,
  onPhotographerToggle,
  onLocationChange,
}: TeamLocationTabProps) => {
  return (
    <div className="space-y-6">
      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">
              Location <span className="text-red-500">*</span>
            </Label>
            <Autocomplete
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
              onPlaceSelected={(place) => {
                if (place.formatted_address) {
                  let countryCode = "";
                  
                  // Auto-fill country if available
                  const countryComponent =
                    place.address_components?.find((component: any) =>
                      component.types.includes("country")
                    );
                  if (countryComponent) {
                    countryCode = countryComponent.short_name;
                    const country = countries.find(
                      (c) => c.code === countryCode
                    );
                    if (country) {
                      countryCode = country.code;
                    }
                  }
                  
                  onLocationChange(place.formatted_address, countryCode);
                }
              }}
              options={{
                types: ["establishment", "geocode"],
                componentRestrictions: { country: [] },
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
                  {formData.country ? (
                    <div className="flex items-center">
                      <span className={`fi fi-${formData.country.toLowerCase()} mr-2`} style={{ fontSize: '16px' }}></span>
                      {countries.find(
                        (country) => country.code === formData.country
                      )?.name}
                    </div>
                  ) : (
                    "Select country..."
                  )}
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
                          onSelectChange("country", country.code);
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
                        <span className={`fi fi-${country.code.toLowerCase()} mr-2`} style={{ fontSize: '16px' }}></span>
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

      {/* Photographers */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Assign Photographers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-4 bg-gray-50 rounded-lg">
          {photographerOptions.map((photographer) => (
            <div
              key={photographer.id}
              className="flex items-center space-x-2 p-2 bg-white rounded border hover:bg-gray-50"
            >
              <Checkbox
                id={photographer.id}
                checked={photographer.checked}
                onCheckedChange={(checked) =>
                  onPhotographerToggle(
                    photographer.id,
                    checked as boolean
                  )
                }
              />
              <Label htmlFor={photographer.id} className="flex-1 cursor-pointer">
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
          onChange={onInputChange}
          placeholder="Add any special instructions or notes for photographers"
          rows={4}
        />
      </div>
    </div>
  );
});

TeamLocationTab.displayName = "TeamLocationTab"; 