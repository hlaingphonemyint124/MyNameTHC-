import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Loader2, Upload, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Slideshow {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  link_url: string | null;
  display_order: number;
  is_active: boolean;
}

export const SlideshowManager = () => {
  const [slideshows, setSlideshows] = useState<Slideshow[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    fetchSlideshows();
  }, []);

  const fetchSlideshows = async () => {
    try {
      const { data, error } = await supabase
        .from("slideshows")
        .select("*")
        .order("display_order");

      if (error) throw error;
      setSlideshows(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch slideshows: " + error.message);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("slideshow-images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast.error("Failed to upload image");
      return null;
    }

    const { data } = supabase.storage
      .from("slideshow-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await uploadImage(imageFile);
      if (!imageUrl) return;

      const { error } = await supabase.from("slideshows").insert({
        title,
        description: description || null,
        image_url: imageUrl,
        link_url: linkUrl || null,
        display_order: slideshows.length,
        is_active: true,
      });

      if (error) throw error;

      toast.success("Slideshow added successfully!");
      setTitle("");
      setDescription("");
      setLinkUrl("");
      setImageFile(null);
      setImagePreview("");
      fetchSlideshows();
    } catch (error: any) {
      toast.error("Failed to add slideshow: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("slideshows")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      toast.success("Slideshow status updated!");
      fetchSlideshows();
    } catch (error: any) {
      toast.error("Failed to update status: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slideshow?")) return;

    try {
      const { error } = await supabase
        .from("slideshows")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Slideshow deleted successfully!");
      fetchSlideshows();
    } catch (error: any) {
      toast.error("Failed to delete slideshow: " + error.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Add New Slideshow</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="slideshow-title">Title</Label>
              <Input
                id="slideshow-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Slideshow title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slideshow-description">Description (Optional)</Label>
              <Textarea
                id="slideshow-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slideshow-link">Link URL (Optional)</Label>
              <Input
                id="slideshow-link"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                type="url"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slideshow-image">Image</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="slideshow-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1"
                />
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 h-32 w-full object-cover rounded-lg"
                />
              )}
            </div>

            <Button type="submit" disabled={loading} variant="premium" className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Slideshow"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Slideshows ({slideshows.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {slideshows.map((slide) => (
              <Card key={slide.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={slide.image_url}
                  alt={slide.title}
                  className="h-48 w-full object-cover"
                />
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-bold text-lg">{slide.title}</h3>
                  {slide.description && (
                    <p className="text-sm text-muted-foreground">{slide.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={slide.is_active}
                        onCheckedChange={() => toggleActive(slide.id, slide.is_active)}
                      />
                      <Label className="text-sm flex items-center gap-1">
                        {slide.is_active ? (
                          <>
                            <Eye className="h-4 w-4" /> Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-4 w-4" /> Hidden
                          </>
                        )}
                      </Label>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(slide.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
