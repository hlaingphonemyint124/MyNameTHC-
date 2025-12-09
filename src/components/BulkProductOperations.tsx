import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Package, Trash2, Star, Sparkles, ToggleLeft, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface BulkProductOperationsProps {
  products: any[];
  onRefresh: () => void;
}

export const BulkProductOperations = ({ products, onRefresh }: BulkProductOperationsProps) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const query = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const bulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.error("No products selected");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedProducts.length} product(s)?`)) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .in("id", selectedProducts);

      if (error) throw error;

      toast.success(`Successfully deleted ${selectedProducts.length} product(s)`);
      setSelectedProducts([]);
      onRefresh();
    } catch (error: any) {
      toast.error("Failed to delete products: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const bulkToggleNew = async () => {
    if (selectedProducts.length === 0) {
      toast.error("No products selected");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_new: true })
        .in("id", selectedProducts);

      if (error) throw error;

      toast.success(`Marked ${selectedProducts.length} product(s) as new`);
      setSelectedProducts([]);
      onRefresh();
    } catch (error: any) {
      toast.error("Failed to update products: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const bulkTogglePopular = async () => {
    if (selectedProducts.length === 0) {
      toast.error("No products selected");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_popular: true })
        .in("id", selectedProducts);

      if (error) throw error;

      toast.success(`Marked ${selectedProducts.length} product(s) as popular`);
      setSelectedProducts([]);
      onRefresh();
    } catch (error: any) {
      toast.error("Failed to update products: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const bulkRemoveNew = async () => {
    if (selectedProducts.length === 0) {
      toast.error("No products selected");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_new: false })
        .in("id", selectedProducts);

      if (error) throw error;

      toast.success(`Removed 'New' badge from ${selectedProducts.length} product(s)`);
      setSelectedProducts([]);
      onRefresh();
    } catch (error: any) {
      toast.error("Failed to update products: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const bulkRemovePopular = async () => {
    if (selectedProducts.length === 0) {
      toast.error("No products selected");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_popular: false })
        .in("id", selectedProducts);

      if (error) throw error;

      toast.success(`Removed 'Popular' badge from ${selectedProducts.length} product(s)`);
      setSelectedProducts([]);
      onRefresh();
    } catch (error: any) {
      toast.error("Failed to update products: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-12 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Bulk Product Operations
        </CardTitle>
        <CardDescription>
          Select multiple products and perform batch operations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-accent"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAll}
            disabled={loading}
          >
            <ToggleLeft className="mr-2 h-4 w-4" />
            {selectedProducts.length === products.length ? "Deselect All" : "Select All"}
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={bulkToggleNew}
            disabled={loading || selectedProducts.length === 0}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Mark as New
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={bulkTogglePopular}
            disabled={loading || selectedProducts.length === 0}
          >
            <Star className="mr-2 h-4 w-4" />
            Mark as Popular
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={bulkRemoveNew}
            disabled={loading || selectedProducts.length === 0}
          >
            Remove 'New'
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={bulkRemovePopular}
            disabled={loading || selectedProducts.length === 0}
          >
            Remove 'Popular'
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={bulkDelete}
            disabled={loading || selectedProducts.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected ({selectedProducts.length})
          </Button>
        </div>

        {/* Product List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-accent/5 transition-colors"
            >
              <Checkbox
                checked={selectedProducts.includes(product.id)}
                onCheckedChange={() => toggleProduct(product.id)}
              />
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{product.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                  {product.is_new && (
                    <Badge variant="default" className="text-xs">
                      <Sparkles className="mr-1 h-3 w-3" /> New
                    </Badge>
                  )}
                  {product.is_popular && (
                    <Badge variant="default" className="text-xs">
                      <Star className="mr-1 h-3 w-3" /> Popular
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  THC: {product.thc}% | CBD: {product.cbd}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
