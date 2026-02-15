"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ElectionSettings({ electionId }) {
  const [settings, setSettings] = useState({
    faceVerification: false,
    otpVerification: false,
    isLive: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`/api/admin/elections/${electionId}`);
        if (response.ok) {
          const election = await response.json();
          setSettings({
            faceVerification: election.faceVerification || false,
            otpVerification: election.otpVerification || false,
            isLive: election.isLive || false,
          });
        }
      } catch (error) {
        console.error("Failed to fetch election settings:", error);
        toast.error("Failed to load election settings");
      } finally {
        setLoading(false);
      }
    };

    if (electionId) {
      fetchSettings();
    }
  }, [electionId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        `/api/admin/elections/${electionId}/settings`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settings),
        }
      );

      if (response.ok) {
        toast.success("Election settings updated successfully!");
      } else {
        throw new Error("Failed to update settings");
      }
    } catch (error) {
      console.error("Failed to save election settings:", error);
      toast.error("Failed to save election settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading settings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <CardTitle>Election Verification Settings</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label
                htmlFor="face-verification"
                className="text-base font-medium"
              >
                Face Verification
              </Label>
              <p className="text-sm text-muted-foreground">
                Require voters to verify their identity using facial recognition
              </p>
            </div>
            <Switch
              id="face-verification"
              checked={settings.faceVerification}
              onCheckedChange={(checked) =>
                handleSettingChange("faceVerification", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label
                htmlFor="otp-verification"
                className="text-base font-medium"
              >
                OTP Verification
              </Label>
              <p className="text-sm text-muted-foreground">
                Require voters to verify their phone number with OTP
              </p>
            </div>
            <Switch
              id="otp-verification"
              checked={settings.otpVerification}
              onCheckedChange={(checked) =>
                handleSettingChange("otpVerification", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="live-results" className="text-base font-medium">
                Live Results
              </Label>
              <p className="text-sm text-muted-foreground">
                Show live voting results to voters during the election
              </p>
            </div>
            <Switch
              id="live-results"
              checked={settings.isLive}
              onCheckedChange={(checked) =>
                handleSettingChange("isLive", checked)
              }
            />
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? (
            "Saving..."
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
