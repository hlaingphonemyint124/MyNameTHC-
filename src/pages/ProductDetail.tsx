import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EffectIcon } from "@/components/EffectIcon";
import { ArrowLeft } from "lucide-react";
import indicaImg from "@/assets/product-indica.jpg";
import sativaImg from "@/assets/product-sativa.jpg";
import hybridImg from "@/assets/product-hybrid.jpg";
import { supabase } from "@/integrations/supabase/client";

const imageMap = {
  indica: indicaImg,
  sativa: sativaImg,
  hybrid: hybridImg,
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container px-4 pt-24 pb-20 text-center">
          <p className="text-xl text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container px-4 pt-24 pb-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button variant="premium">Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Determine which fallback image to use based on category
  const getFallbackImage = () => {
    const category = product.category.toLowerCase();
    return imageMap[category as keyof typeof imageMap];
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container px-4 pt-24 pb-12">
        <Link to="/products">
          <Button variant="ghost" className="mb-4 md:mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
          {/* Product Image */}
          <div className="rounded-2xl overflow-hidden border border-border shadow-2xl shadow-accent/20">
            <img
              src={product.image_url || getFallbackImage()}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-4 md:space-y-6">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 md:gap-4 mb-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">{product.name}</h1>
                <Badge variant="outline" className="bg-primary/20 border-accent text-accent-foreground text-base md:text-lg px-3 md:px-4 py-1 self-start">
                  {product.category}
                </Badge>
              </div>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* THC/CBD */}
            <div className="bg-gradient-card rounded-xl p-4 md:p-6 border border-border">
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Cannabinoid Profile</h3>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="bg-primary/20 rounded-lg p-3 md:p-4 border border-accent/30">
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">THC Content</p>
                  <p className="text-2xl md:text-3xl font-bold text-accent">{product.thc}%</p>
                </div>
                <div className="bg-primary/20 rounded-lg p-3 md:p-4 border border-border">
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">CBD Content</p>
                  <p className="text-2xl md:text-3xl font-bold">{product.cbd}%</p>
                </div>
              </div>
            </div>

            {/* Effects */}
            <div className="bg-gradient-card rounded-xl p-6 border border-border">
              <h3 className="text-xl font-bold mb-4">Effects</h3>
              <div className="flex flex-wrap gap-3">
                {product.effects.map((effect) => (
                  <EffectIcon key={effect} effect={effect} />
                ))}
              </div>
            </div>

            {/* Aroma & Flavor */}
            <div className="bg-gradient-card rounded-xl p-6 border border-border">
              <h3 className="text-xl font-bold mb-4">Aroma & Flavor Profile</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Aroma</p>
                  <div className="flex flex-wrap gap-2">
                    {product.aroma.map((note) => (
                      <Badge key={note} variant="secondary" className="text-sm">
                        {note}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Flavor</p>
                  <div className="flex flex-wrap gap-2">
                    {product.flavor.map((note) => (
                      <Badge key={note} variant="secondary" className="text-sm">
                        {note}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-secondary/30 rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground">
                <strong>Legal Notice:</strong> My Name THC operates in compliance with Thai cannabis regulations. 
                For adults 21+ only. Please verify local laws.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
