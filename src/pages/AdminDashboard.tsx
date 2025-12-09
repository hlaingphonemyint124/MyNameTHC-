import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import { toast } from "sonner";
import { Plus, Trash2, Upload, Pencil, Package, Images, Users, Star, Sparkles } from "lucide-react";
import { z } from "zod";
import { SlideshowManager } from "@/components/SlideshowManager";
import { UserManagement } from "@/components/UserManagement";
import { BulkProductOperations } from "@/components/BulkProductOperations";
import { FeaturedProductsManager } from "@/components/FeaturedProductsManager";
import { Switch } from "@/components/ui/switch";

const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  category: z.enum(["Indica", "Sativa", "Hybrid", "Accessories"]),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  thc: z.number().min(0).max(100),
  cbd: z.number().min(0).max(100),
});

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"Indica" | "Sativa" | "Hybrid" | "Accessories">("Indica");
  const [description, setDescription] = useState("");
  const [thc, setThc] = useState("");
  const [cbd, setCbd] = useState("");
  const [effects, setEffects] = useState("");
  const [aroma, setAroma] = useState("");
  const [flavor, setFlavor] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [isPopular, setIsPopular] = useState(false);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch products");
      console.error(error);
    } else {
      setProducts(data || []);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setName(product.name);
    setCategory(product.category);
    setDescription(product.description);
    setThc(product.thc.toString());
    setCbd(product.cbd.toString());
    setEffects(product.effects?.join(", ") || "");
    setAroma(product.aroma?.join(", ") || "");
    setFlavor(product.flavor?.join(", ") || "");
    setIsNew(product.is_new || false);
    setIsPopular(product.is_popular || false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setCategory("Indica");
    setDescription("");
    setThc("");
    setCbd("");
    setEffects("");
    setAroma("");
    setFlavor("");
    setIsNew(false);
    setIsPopular(false);
    setImageFile(null);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast.error("Failed to upload image");
      return null;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form
      productSchema.parse({
        name,
        category,
        description,
        thc: parseFloat(thc),
        cbd: parseFloat(cbd),
      });

      setLoading(true);

      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        if (!imageUrl) {
          setLoading(false);
          return;
        }
      }

      const productData = {
        name,
        category,
        description,
        thc: parseFloat(thc),
        cbd: parseFloat(cbd),
        effects: effects.split(",").map((e) => e.trim()).filter(Boolean),
        aroma: aroma.split(",").map((a) => a.trim()).filter(Boolean),
        flavor: flavor.split(",").map((f) => f.trim()).filter(Boolean),
        is_new: isNew,
        is_popular: isPopular,
        ...(imageUrl && { image_url: imageUrl }),
      };

      if (editingId) {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingId);

        if (error) {
          toast.error("Failed to update product");
          console.error(error);
        } else {
          toast.success("Product updated successfully!");
          handleCancelEdit();
          fetchProducts();
        }
      } else {
        // Insert new product
        const { error } = await supabase.from("products").insert(productData);

        if (error) {
          toast.error("Failed to add product");
          console.error(error);
        } else {
          toast.success("Product added successfully!");
          // Reset form
          setName("");
          setDescription("");
          setThc("");
          setCbd("");
          setEffects("");
          setAroma("");
          setFlavor("");
          setIsNew(false);
          setIsPopular(false);
          setImageFile(null);
          fetchProducts();
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(editingId ? "Failed to update product" : "Failed to add product");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete product");
      console.error(error);
    } else {
      toast.success("Product deleted successfully");
      fetchProducts();
    }
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container px-4 pt-24 pb-20 text-center">
          <p className="text-xl text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container px-4 pt-24 pb-12 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 bg-gradient-gold bg-clip-text text-transparent">
          Admin Dashboard
        </h1>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-6 md:mb-8 h-auto">
            <TabsTrigger value="products" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm py-2">
              <Package className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Products</span>
              <span className="sm:hidden">Prod</span>
            </TabsTrigger>
            <TabsTrigger value="featured" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm py-2">
              <Star className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Featured</span>
              <span className="sm:hidden">Feat</span>
            </TabsTrigger>
            <TabsTrigger value="slideshow" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm py-2">
              <Images className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">Slideshow</span>
              <span className="sm:hidden">Slide</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm py-2">
              <Users className="h-3 w-3 md:h-4 md:w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-12">
        
        {/* Bulk Operations */}
        <BulkProductOperations products={products} onRefresh={fetchProducts} />

        {/* Add/Edit Product Form */}
        <Card className="mb-12 bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {editingId ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              {editingId ? "Edit Product" : "Add New Product"}
            </CardTitle>
            <CardDescription>
              {editingId ? "Update the cannabis strain details" : "Upload a new cannabis strain to the catalog"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Strain Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Purple Kush"
                    required
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Indica">Indica</SelectItem>
                      <SelectItem value="Sativa">Sativa</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thc">THC % *</Label>
                  <Input
                    id="thc"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={thc}
                    onChange={(e) => setThc(e.target.value)}
                    placeholder="e.g., 22.5"
                    required
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cbd">CBD % *</Label>
                  <Input
                    id="cbd"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={cbd}
                    onChange={(e) => setCbd(e.target.value)}
                    placeholder="e.g., 0.5"
                    required
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the strain's characteristics..."
                  required
                  className="bg-background min-h-[100px]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="is-new" 
                    checked={isNew} 
                    onCheckedChange={setIsNew}
                  />
                  <Label htmlFor="is-new" className="flex items-center gap-2 cursor-pointer">
                    <Sparkles className="h-4 w-4 text-accent" />
                    Mark as New Product
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="is-popular" 
                    checked={isPopular} 
                    onCheckedChange={setIsPopular}
                  />
                  <Label htmlFor="is-popular" className="flex items-center gap-2 cursor-pointer">
                    <Star className="h-4 w-4 text-accent" />
                    Mark as Popular
                  </Label>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="effects">Effects (comma-separated)</Label>
                  <Input
                    id="effects"
                    value={effects}
                    onChange={(e) => setEffects(e.target.value)}
                    placeholder="Relaxing, Sleepy"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aroma">Aroma (comma-separated)</Label>
                  <Input
                    id="aroma"
                    value={aroma}
                    onChange={(e) => setAroma(e.target.value)}
                    placeholder="Earthy, Sweet, Pine"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flavor">Flavor (comma-separated)</Label>
                  <Input
                    id="flavor"
                    value={flavor}
                    onChange={(e) => setFlavor(e.target.value)}
                    placeholder="Grape, Berry, Earth"
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Product Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="bg-background"
                  />
                  {imageFile && (
                    <span className="text-sm text-muted-foreground">{imageFile.name}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Recommended: 800x800px</p>
              </div>

              <div className="flex gap-4">
                <Button type="submit" variant="premium" disabled={loading} className="w-full md:w-auto">
                  {loading ? (editingId ? "Updating..." : "Adding...") : (editingId ? "Update Product" : "Add Product")}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={handleCancelEdit} className="w-full md:w-auto">
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Products List */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Existing Products ({products.length})</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="bg-gradient-card border-border">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription>{product.category}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(product)}
                        className="hover:text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>THC:</strong> {product.thc}%</p>
                    <p><strong>CBD:</strong> {product.cbd}%</p>
                    <p className="line-clamp-2">{product.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
          </TabsContent>

          <TabsContent value="featured">
            <FeaturedProductsManager />
          </TabsContent>

          <TabsContent value="slideshow">
            <SlideshowManager />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
