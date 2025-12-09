import { Navbar } from "@/components/Navbar";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { NewProducts } from "@/components/NewProducts";
import { PageTransition } from "@/components/PageTransition";

const Home = () => {
  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />
        
        {/* Hero Slideshow - Full Screen */}
        <HeroSlideshow />

        {/* Featured Products Section */}
        <FeaturedProducts />

        {/* New Products Section */}
        <NewProducts />

        {/* Legal Disclaimer */}
        <section className="py-8 bg-secondary/30 border-t border-border">
          <div className="container px-4 animate-fade-in">
            <p className="text-center text-xs md:text-sm text-muted-foreground max-w-3xl mx-auto">
              <strong>Legal Notice:</strong> My Name THC operates in compliance with Thai cannabis regulations. 
              For adults 21+ only. Please verify local laws regarding cannabis use and possession. 
              Always consume responsibly.
            </p>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Home;
