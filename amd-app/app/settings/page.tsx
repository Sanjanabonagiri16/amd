"use client";
import { useState } from "react";
import { Moon, Sun, Bell, Shield, User, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useTheme } from "@/components/providers/theme-provider";
import { toast } from "sonner";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    name: "Admin User",
    email: "admin@example.com",
    defaultStrategy: "twilio_native",
    notifications: "all",
    autoExport: false
  });

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>Profile</CardTitle>
          </div>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* AMD Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>AMD Preferences</CardTitle>
          </div>
          <CardDescription>Configure default detection settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Default Strategy</label>
            <Select
              value={settings.defaultStrategy}
              onChange={(e) => setSettings({ ...settings, defaultStrategy: e.target.value })}
            >
              <option value="twilio_native">Twilio Native AMD</option>
              <option value="jambonz_sip">Jambonz SIP AMD</option>
              <option value="hf_service">Hugging Face ML</option>
              <option value="gemini_flash">Gemini Flash</option>
            </Select>
            <p className="text-xs text-muted-foreground">
              This strategy will be pre-selected when making calls
            </p>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Auto-export call logs</p>
              <p className="text-sm text-muted-foreground">
                Automatically export call history daily
              </p>
            </div>
            <Button
              variant={settings.autoExport ? "default" : "outline"}
              size="sm"
              onClick={() => setSettings({ ...settings, autoExport: !settings.autoExport })}
            >
              {settings.autoExport ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>Manage how you receive alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Notification Level</label>
            <Select
              value={settings.notifications}
              onChange={(e) => setSettings({ ...settings, notifications: e.target.value })}
            >
              <option value="all">All notifications</option>
              <option value="errors">Errors only</option>
              <option value="none">None</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <CardTitle>Appearance</CardTitle>
          </div>
          <CardDescription>Customize the look and feel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-muted-foreground">
                Currently using {theme} mode
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              {theme === "dark" ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark Mode
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave}>
          <Save className="mr-2 h-5 w-5" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
