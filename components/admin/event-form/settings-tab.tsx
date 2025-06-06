"use client";

import { memo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SettingsTabProps {
  formData: {
    geoSnapshotEmbed?: string;
    url?: string;
  };
  isEditing: boolean;
  sendConfirmationEmail: boolean;
  sendNewsletterNotification: boolean;
  sendUpdateNotification: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onConfirmationEmailChange: (checked: boolean) => void;
  onNewsletterNotificationChange: (checked: boolean) => void;
  onUpdateNotificationChange: (checked: boolean) => void;
}

export const SettingsTab = memo(({
  formData,
  isEditing,
  sendConfirmationEmail,
  sendNewsletterNotification,
  sendUpdateNotification,
  onInputChange,
  onConfirmationEmailChange,
  onNewsletterNotificationChange,
  onUpdateNotificationChange,
}: SettingsTabProps) => {
  return (
    <div className="space-y-6">
      {/* Additional Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Additional Settings</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="geoSnapshotEmbed">
              Geo Snapshot Embed Code
            </Label>
            <Textarea
              id="geoSnapshotEmbed"
              name="geoSnapshotEmbed"
              value={formData.geoSnapshotEmbed}
              onChange={onInputChange}
              placeholder="Paste your Geo Snapshot embed code here"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Event URL</Label>
            <Input
              id="url"
              name="url"
              type="url"
              value={formData.url}
              onChange={onInputChange}
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>

      {/* Email Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          📧 Email Options
        </h3>
        
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
          {isEditing ? (
            // Options for editing mode
            <>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sendUpdateNotification"
                  checked={sendUpdateNotification}
                  onCheckedChange={onUpdateNotificationChange}
                />
                <Label htmlFor="sendUpdateNotification" className="font-medium">
                  Send event update notification to newsletter subscribers
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sendConfirmationEmail"
                  checked={sendConfirmationEmail}
                  onCheckedChange={onConfirmationEmailChange}
                />
                <Label htmlFor="sendConfirmationEmail" className="font-medium">
                  Send update notification to assigned photographers
                </Label>
              </div>
              
              <p className="text-sm text-gray-600">
                💡 Note: This will notify all newsletter subscribers and assigned photographers about the event updates.
              </p>
            </>
          ) : (
            // Options for creating mode
            <>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sendConfirmationEmail"
                  checked={sendConfirmationEmail}
                  onCheckedChange={onConfirmationEmailChange}
                />
                <Label htmlFor="sendConfirmationEmail" className="font-medium">
                  Send confirmation email to assigned photographers
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sendNewsletterNotification"
                  checked={sendNewsletterNotification}
                  onCheckedChange={onNewsletterNotificationChange}
                />
                <Label htmlFor="sendNewsletterNotification" className="font-medium">
                  Send new event notification to newsletter subscribers
                </Label>
              </div>
              
              <p className="text-sm text-gray-600">
                💡 Note: If a photographer is also a newsletter subscriber, they will only receive the confirmation email.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

SettingsTab.displayName = "SettingsTab"; 