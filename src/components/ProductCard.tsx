import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/data/products";
import indicaImg from "@/assets/product-indica.jpg";
import sativaImg from "@/assets/product-sativa.jpg";
import hybridImg from "@/assets/product-hybrid.jpg";
import { Sparkles, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const imageMap = {
  indica: indicaImg,
  sativa: sativaImg,
  hybrid: hybridImg,
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  
  const getFallbackImage = () => {
    if (product.image && product.image in imageMap) {
      return imageMap[product.image as keyof typeof imageMap];
    }
    const category = product.category.toLowerCase();
    return imageMap[category as keyof typeof imageMap] || indicaImg;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Navigate to product detail when clicking anywhere on the card
    navigate(`/products/${product.id}`);
  };

  const handleLineClick = (e: React.MouseEvent) => {
    // Prevent card navigation when clicking Line button
    e.stopPropagation();
  };

  return (
    <Card 
      onClick={handleCardClick}
      className="overflow-hidden bg-gradient-card border-border hover:border-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 hover:scale-105 animate-fade-in cursor-pointer group"
    >
      <div className="aspect-square overflow-hidden relative">
        <img
          src={product.image_url || getFallbackImage()}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
        />
        {/* Badges for New and Popular */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {product.is_new && (
            <Badge className="bg-accent text-accent-foreground shadow-lg animate-pulse flex items-center gap-1 transition-transform hover:scale-110">
              <Sparkles className="h-3 w-3" />
              New
            </Badge>
          )}
          {product.is_popular && (
            <Badge className="bg-gradient-gold text-accent-foreground shadow-lg flex items-center gap-1 transition-transform hover:scale-110">
              <Star className="h-3 w-3" />
              Popular
            </Badge>
          )}
        </div>
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl group-hover:text-accent transition-colors duration-300">{product.name}</CardTitle>
          <Badge variant="outline" className="bg-primary/20 border-accent text-accent-foreground">
            {product.category}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">THC: </span>
            <span className="font-semibold text-accent">{product.thc}%</span>
          </div>
          <div>
            <span className="text-muted-foreground">CBD: </span>
            <span className="font-semibold">{product.cbd}%</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="premium" className="flex-1 transition-all duration-300 hover:shadow-lg hover:shadow-accent/30">
          View Details
        </Button>
        <a
          href="https://line.me/R/ti/p/@674dxgnq"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0"
          onClick={handleLineClick}
        >
          <Button variant="outline" className="bg-[#00B900] hover:bg-[#00B900]/90 text-white border-[#00B900] hover:border-[#00B900]/90 transition-all duration-300 hover:scale-110 hover:shadow-lg">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
};
