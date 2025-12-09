import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { Leaf, Award, Users, Heart } from "lucide-react";

const About = () => {
  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />
        
        <div className="container px-4 pt-24 pb-12">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-gold bg-clip-text text-transparent">
              About My Name THC
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Quality medical-grade cannabis at fair local prices
            </p>
          </div>

        {/* Mission Section */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-20">
          <div className="bg-gradient-card rounded-2xl p-6 md:p-8 lg:p-12 border border-border">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-gold flex items-center justify-center">
                <Leaf className="h-5 w-5 md:h-6 md:w-6 text-accent-foreground" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Our Mission</h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              My Name THC offers high-quality, medical-grade cannabis and accessories at fair local prices. 
              Proudly serving customers throughout Thailand with trusted products and professional, reliable service.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-20">
          <div className="bg-gradient-card rounded-xl p-6 md:p-8 border border-border text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 md:h-8 md:w-8 text-accent" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-3">Quality First</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              We showcase only the finest, lab-tested strains that meet our rigorous quality standards.
            </p>
          </div>

          <div className="bg-gradient-card rounded-xl p-6 md:p-8 border border-border text-center">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 md:h-8 md:w-8 text-accent" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-3">Community Focused</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Building a knowledgeable and responsible cannabis community through education.
            </p>
          </div>

          <div className="bg-gradient-card rounded-xl p-6 md:p-8 border border-border text-center sm:col-span-2 md:col-span-1">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 md:h-8 md:w-8 text-accent" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-3">Passion Driven</h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Our team consists of cannabis enthusiasts and experts who love what they do.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Founded by a group of cannabis connoisseurs and wellness advocates, Premium Cannabis 
              began with a simple vision: to create a trusted resource for cannabis education and 
              strain information.
            </p>
            <p>
              What started as a small passion project has grown into a comprehensive platform 
              dedicated to showcasing the finest cannabis strains available. We work with experts 
              in cultivation, testing, and cannabis science to ensure our information is accurate, 
              up-to-date, and valuable to our community.
            </p>
            <p>
              While we don't sell products directly, we're proud to serve as an educational resource, 
              helping consumers understand the unique characteristics of different strains, their 
              effects, and their optimal uses. Our commitment to transparency and education sets us 
              apart in the cannabis industry.
            </p>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="mt-20 max-w-4xl mx-auto bg-secondary/30 rounded-xl p-8 border border-border">
          <h3 className="text-xl font-bold mb-4">Legal & Compliance</h3>
          <p className="text-muted-foreground leading-relaxed">
            My Name THC operates in full compliance with Thai cannabis regulations. 
            We are committed to providing safe, quality products and responsible service. 
            All customers must be 21 years of age or older. Please verify local laws 
            regarding cannabis use and possession in your area.
          </p>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default About;
