import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Palette, Type, Layout } from "lucide-react";

interface DesignSettings {
  id: number;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  fontFamily: string;
  headingFont: string;
  fontSize: string;
  layoutStyle: string;
  borderRadius: string;
  updatedAt: Date;
}

export default function DesignSettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery<DesignSettings>({
    queryKey: ["/api/design-settings"],
  });

  const [formData, setFormData] = useState<Partial<DesignSettings>>({});

  // Update formData when settings load
  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<DesignSettings>) => {
      const response = await fetch("/api/design-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update settings");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/design-settings"] });
      toast({
        title: "Success!",
        description: "Design settings updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update design settings",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return <div className="p-8">Loading design settings...</div>;
  }

  const currentSettings = { ...settings, ...formData };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Design Settings</h1>
          <p className="text-gray-600 mt-2">Customize the appearance of your website</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Colors Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Colors
              </CardTitle>
              <CardDescription>Customize your website's color scheme</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="primaryColor"
                    value={currentSettings.primaryColor || "#3b82f6"}
                    onChange={(e) => handleChange("primaryColor", e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={currentSettings.primaryColor || "#3b82f6"}
                    onChange={(e) => handleChange("primaryColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="secondaryColor"
                    value={currentSettings.secondaryColor || "#8b5cf6"}
                    onChange={(e) => handleChange("secondaryColor", e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={currentSettings.secondaryColor || "#8b5cf6"}
                    onChange={(e) => handleChange("secondaryColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backgroundColor">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="backgroundColor"
                    value={currentSettings.backgroundColor || "#ffffff"}
                    onChange={(e) => handleChange("backgroundColor", e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={currentSettings.backgroundColor || "#ffffff"}
                    onChange={(e) => handleChange("backgroundColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="textColor"
                    value={currentSettings.textColor || "#1f2937"}
                    onChange={(e) => handleChange("textColor", e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={currentSettings.textColor || "#1f2937"}
                    onChange={(e) => handleChange("textColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonColor">Button Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="buttonColor"
                    value={currentSettings.buttonColor || "#3b82f6"}
                    onChange={(e) => handleChange("buttonColor", e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={currentSettings.buttonColor || "#3b82f6"}
                    onChange={(e) => handleChange("buttonColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="buttonTextColor">Button Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="buttonTextColor"
                    value={currentSettings.buttonTextColor || "#ffffff"}
                    onChange={(e) => handleChange("buttonTextColor", e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={currentSettings.buttonTextColor || "#ffffff"}
                    onChange={(e) => handleChange("buttonTextColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Typography Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                Typography
              </CardTitle>
              <CardDescription>Customize fonts and text sizes</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fontFamily">Body Font</Label>
                <Select
                  value={currentSettings.fontFamily || "Inter"}
                  onValueChange={(value) => handleChange("fontFamily", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Lato">Lato</SelectItem>
                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="headingFont">Heading Font</Label>
                <Select
                  value={currentSettings.headingFont || "Inter"}
                  onValueChange={(value) => handleChange("headingFont", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Lato">Lato</SelectItem>
                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                    <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size</Label>
                <Select
                  value={currentSettings.fontSize || "medium"}
                  onValueChange={(value) => handleChange("fontSize", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Layout Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="w-5 h-5" />
                Layout
              </CardTitle>
              <CardDescription>Customize layout and styling</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="layoutStyle">Layout Style</Label>
                <Select
                  value={currentSettings.layoutStyle || "modern"}
                  onValueChange={(value) => handleChange("layoutStyle", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="borderRadius">Border Radius</Label>
                <Select
                  value={currentSettings.borderRadius || "medium"}
                  onValueChange={(value) => handleChange("borderRadius", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Sharp)</SelectItem>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large (Rounded)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>See how your changes will look</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="p-8 rounded-lg border"
                style={{
                  backgroundColor: currentSettings.backgroundColor,
                  color: currentSettings.textColor,
                  fontFamily: currentSettings.fontFamily,
                }}
              >
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{
                    color: currentSettings.primaryColor,
                    fontFamily: currentSettings.headingFont,
                  }}
                >
                  Sample Heading
                </h2>
                <p className="mb-4">
                  This is how your text will look with the current settings. The quick brown fox
                  jumps over the lazy dog.
                </p>
                <button
                  className="px-6 py-2 rounded"
                  style={{
                    backgroundColor: currentSettings.buttonColor,
                    color: currentSettings.buttonTextColor,
                    borderRadius:
                      currentSettings.borderRadius === "none"
                        ? "0"
                        : currentSettings.borderRadius === "small"
                          ? "0.25rem"
                          : currentSettings.borderRadius === "large"
                            ? "1rem"
                            : "0.5rem",
                  }}
                >
                  Sample Button
                </button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
