"use client";

import { memo } from "react";
import { FileImage, Tag, Trash2 } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContentMediaTabProps {
  formData: {
    tags?: string[];
  };
  imagePreview: string | null;
  bestOfImagePreviews: string[];
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "bestOfImage") => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onRemoveBestOfImage: (index: number) => void;
}

export const ContentMediaTab = memo(({
  formData,
  imagePreview,
  bestOfImagePreviews,
  tagInput,
  onTagInputChange,
  onImageChange,
  onAddTag,
  onRemoveTag,
  onRemoveBestOfImage,
}: ContentMediaTabProps) => {
  return (
    <div className="space-y-6">
      {/* Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileImage className="h-5 w-5" />
          Images
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="image">
              Event Image <span className="text-red-500">*</span>
            </Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={(e) => onImageChange(e, "image")}
            />
            {imagePreview && (
              <div className="mt-2">
                <Image
                  src={imagePreview}
                  alt="Event preview"
                  width={300}
                  height={200}
                  className="rounded-md object-cover w-full"
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
              onChange={(e) => onImageChange(e, "bestOfImage")}
            />
            <div className="grid grid-cols-2 gap-2 mt-2">
              {bestOfImagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <Image
                    src={preview}
                    alt={`Best of preview ${index + 1}`}
                    width={150}
                    height={100}
                    className="rounded-md object-cover w-full"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                    onClick={() => onRemoveBestOfImage(index)}
                  >
                    <Trash2 className="h-3 w-3" />
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

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => onTagInputChange(e.target.value)}
              placeholder="Add a tag"
              onKeyPress={(e) => e.key === "Enter" && onAddTag()}
              className="flex-1"
            />
            <Button type="button" onClick={onAddTag}>
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
                  onClick={() => onRemoveTag(tag)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

ContentMediaTab.displayName = "ContentMediaTab"; 