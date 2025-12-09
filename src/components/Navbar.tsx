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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Products" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/40 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={logo}
              alt="My Name THC"
              className="h-10 w-auto transition-transform group-hover:scale-110"
            />
            <div className="hidden sm:flex flex-col -space-y-1">
              <span className="text-white font-semibold">My Name THC</span>
              <span className="text-xs text-white/70">มายเนมทีเอชซี</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm transition-colors hover:text-accent ${
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
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ProfileAvatar />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm truncate">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin
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
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-white" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="top"
                className="h-screen bg-black/80 backdrop-blur-xl flex items-center justify-center"
              >
                <div className="w-full max-w-sm space-y-6 text-center">

                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.path}>
                      <Link
                        to={link.path}
                        className={`block text-xl ${
                          isActive(link.path)
                            ? "text-accent"
                            : "text-white"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}

                  <div className="border-t border-white/10 pt-4 space-y-3">
                    {user ? (
                      <>
                        <SheetClose asChild>
                          <Link to="/profile" className="block text-white">
                            Profile
                          </Link>
                        </SheetClose>

                        {isAdmin && (
                          <SheetClose asChild>
                            <Link to="/admin" className="block text-white">
                              Admin
                            </Link>
                          </SheetClose>
                        )}

                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={handleSignOut}
                        >
                          Sign Out
                        </Button>
                      </>
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
