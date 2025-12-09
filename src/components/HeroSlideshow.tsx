import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronRight, ShoppingBag, ChevronDown, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Slideshow {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  link_url: string | null;
  display_order: number;
}

export const HeroSlideshow = () => {
  const [slideshows, setSlideshows] = useState<Slideshow[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSlideshows();
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    if (slideshows.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideshows.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slideshows.length]);

  const fetchSlideshows = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("slideshows")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      setSlideshows(data || []);
    } catch (error) {
      console.error("Error fetching slideshows:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slideshows.length) % slideshows.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slideshows.length);
  };

  const currentSlide = slideshows[currentIndex];

  if (loading) {
    return (
      <section className="relative w-full h-screen overflow-hidden bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </section>
    );
  }

  if (slideshows.length === 0) {
    return (
      <section className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-primary via-background to-secondary flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold text-foreground mb-4">Welcome to My Name THC</h1>
          <p className="text-xl text-muted-foreground">Premium Cannabis Products</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Slides - Using CSS opacity for smooth transitions */}
      {slideshows.map((slide, index) => (
        <div
          key={slide.id}
          className="absolute inset-0"
          style={{
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 10 : 0,
            transition: "opacity 800ms ease-out",
          }}
        >
          {/* Background Image */}
          <img
            src={slide.image_url}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading={index === 0 ? "eager" : "lazy"}
          />
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        </div>
      ))}

      {/* Content - Always visible on top */}
      {currentSlide && (
        <div className="absolute inset-0 flex items-center justify-center z-20 px-4">
          <div className="container mx-auto px-4 sm:px-6 md:px-12 text-center max-w-4xl">
            <h1 
              key={`title-${currentIndex}`}
              className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white drop-shadow-2xl italic animate-fade-in"
            >
              {currentSlide.title}
            </h1>
            
            {currentSlide.description && (
              <p 
                key={`desc-${currentIndex}`}
                className="text-sm sm:text-base md:text-xl lg:text-2xl mb-6 md:mb-8 text-white/90 max-w-2xl mx-auto italic animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                {currentSlide.description}
              </p>
            )}
            
            <div 
              className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <Button
                variant="premium"
                size="lg"
                onClick={() => navigate("/products")}
                className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 animate-bounce-subtle hover:animate-none"
              >
                <ShoppingBag className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5" />
                Browse Products
              </Button>
              
              {currentSlide.link_url && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.open(currentSlide.link_url!, "_blank")}
                  className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 border-2 border-white/80 bg-white/10 text-white hover:bg-white hover:text-black"
                >
                  Learn More <ChevronRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      {slideshows.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 hover:bg-white/40 transition-all flex items-center justify-center hidden sm:flex"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 hover:bg-white/40 transition-all flex items-center justify-center hidden sm:flex"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {slideshows.length > 1 && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slideshows.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? "bg-white w-6 md:w-8" 
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}

      {/* Scroll Down Indicator */}
      <div
        onClick={scrollToContent}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center cursor-pointer group"
      >
        <span className="text-white/80 text-sm font-medium mb-2 animate-pulse group-hover:text-white transition-colors">
          Scroll Down
        </span>
        <ChevronDown className="h-6 w-6 text-white/80 animate-bounce group-hover:text-white transition-colors" />
      </div>
    </section>
  );
};
