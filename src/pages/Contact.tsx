import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Contact = () => {
  const handleEmailClick = () => {
    window.location.href = "mailto:thcmyname@gmail.com";
  };

  const handlePhoneClick = () => {
    window.location.href = "tel:0973595888";
  };

  const handleMapClick = () => {
    window.open("https://maps.app.goo.gl/kx85waNAaVYgbcnW6", "_blank");
  };

  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />
        
        <div className="container px-4 pt-24 pb-12">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-gold bg-clip-text text-transparent">
              Get In Touch
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto mb-12 md:mb-16">
            <Card 
              className="bg-gradient-card border-border hover:border-accent transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group"
              onClick={handleEmailClick}
            >
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors duration-300">
                  <Mail className="h-6 w-6 md:h-8 md:w-8 text-accent group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-bold mb-2 group-hover:text-accent transition-colors duration-300">Email Us</h3>
                <p className="text-xs md:text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300 break-all">thcmyname@gmail.com</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-gradient-card border-border hover:border-accent transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group"
              onClick={handlePhoneClick}
            >
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors duration-300">
                  <Phone className="h-6 w-6 md:h-8 md:w-8 text-accent group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-bold mb-2 group-hover:text-accent transition-colors duration-300">Call Us</h3>
                <p className="text-xs md:text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">0973595888</p>
              </CardContent>
            </Card>

            <Card 
              className="bg-gradient-card border-border hover:border-accent transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group sm:col-span-2 md:col-span-1"
              onClick={handleMapClick}
            >
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors duration-300">
                  <MapPin className="h-6 w-6 md:h-8 md:w-8 text-accent group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-bold mb-2 group-hover:text-accent transition-colors duration-300">Visit Us</h3>
                <p className="text-xs md:text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">9/10, Hussadhisawee Rd, Tambon Chang Phueak, Mueang Chiang Mai District, Chiang Mai 50300</p>
              </CardContent>
            </Card>

          </div>

          {/* Google Maps Embed */}
          <div className="max-w-6xl mx-auto mb-12 md:mb-16 animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Find Us on the Map</h2>
            <div className="rounded-2xl overflow-hidden border border-border shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3776.5!2d98.9847!3d18.8047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3a7e9a4ae1e3%3A0x9d5f3d8c2e8e8e8e!2s9%2F10%20Hussadhisawee%20Rd%2C%20Tambon%20Chang%20Phueak%2C%20Mueang%20Chiang%20Mai%20District%2C%20Chiang%20Mai%2050300!5e0!3m2!1sen!2sth!4v1699999999999!5m2!1sen!2sth"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-card rounded-2xl p-6 md:p-8 lg:p-12 border border-border animate-fade-in">
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              
              <div className="space-y-6 text-muted-foreground">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Business Hours</h3>
                  <p className="leading-relaxed">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">General Inquiries</h3>
                  <p className="leading-relaxed">
                    For general questions about strains, effects, or our platform, please email us at 
                    thcmyname@gmail.com. We typically respond within 24-48 hours.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Educational Resources</h3>
                  <p className="leading-relaxed">
                    Interested in learning more about cannabis? We're here to help! Contact us for 
                    information about strains, consumption methods, effects, and responsible use.
                  </p>
                </div>
              </div>
            </div>

            {/* Legal Notice */}
            <div className="mt-8 bg-secondary/30 rounded-xl p-6 border border-border animate-fade-in">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Legal Notice:</strong> My Name THC operates in compliance with Thai cannabis regulations. 
                This platform is for educational and informational purposes only. For adults 21+ only. 
                Please verify local laws regarding cannabis use and possession.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Contact;
