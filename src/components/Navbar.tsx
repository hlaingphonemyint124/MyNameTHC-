import { Link, useLocation } from "react-router-dom";
import { LogOut, User, Shield, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import logo from "@/assets/logo.png";
import { ThemeToggle } from "./ThemeToggle";
import { ProfileAvatar } from "./ProfileAvatar";

export const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Products" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/40 backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={logo}
              alt="My Name THC"
              className="h-10 md:h-12 w-auto transition-all duration-300 group-hover:scale-110 group-hover:brightness-125"
            />
            <div className="flex flex-col -space-y-1">
              <span className="text-base md:text-lg font-bold text-white group-hover:text-accent transition-colors">
                My Name THC
              </span>
              <span className="text-xs font-medium text-white/80 group-hover:text-accent transition-colors hidden sm:block">
                มายเนมทีเอชซี
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all duration-300 hover:text-accent hover:scale-110 ${
                  isActive(link.path) ? "text-accent" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <ThemeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full p-0 transition-transform hover:scale-110"
                  >
                    <ProfileAvatar />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>

                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="premium" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              {/* ✅ FIXED RESPONSIVE SIDEBAR */}
              <SheetContent
                side="right"
                className="w-[85vw] max-w-xs bg-background/95 backdrop-blur-lg p-6"
              >
                <div className="flex flex-col gap-6 mt-6">

                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.path}>
                      <Link
                        to={link.path}
                        className={`text-lg font-medium transition-colors hover:text-accent ${
                          isActive(link.path) ? "text-accent" : "text-foreground"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}

                  {/* User section */}
                  <div className="border-t border-border pt-4">
                    {user ? (
                      <div className="space-y-4">

                        <p className="text-sm text-muted-foreground truncate">
                          {user.email}
                        </p>

                        <SheetClose asChild>
                          <Link
                            to="/profile"
                            className="flex items-center gap-2 hover:text-accent"
                          >
                            <User className="h-4 w-4" />
                            Profile Settings
                          </Link>
                        </SheetClose>

                        {isAdmin && (
                          <SheetClose asChild>
                            <Link
                              to="/admin"
                              className="flex items-center gap-2 hover:text-accent"
                            >
                              <Shield className="h-4 w-4" />
                              Admin Dashboard
                            </Link>
                          </SheetClose>
                        )}

                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => {
                            handleSignOut();
                            setMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <SheetClose asChild>
                        <Link to="/auth">
                          <Button variant="premium" className="w-full">
                            Sign In
                          </Button>
                        </Link>
                      </SheetClose>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
