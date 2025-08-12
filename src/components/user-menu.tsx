"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader, Menu, X, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";

const UserButton = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll for transparent/solid header transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (status === "loading") {
    return (
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md shadow-sm`}>
        <div className="container mx-auto flex justify-center py-4">
          <Loader className="size-6 animate-spin text-cyan-500" />
        </div>
      </header>
    );
  }

  const avatarFallback = session?.user?.name?.charAt(0).toUpperCase() || "?";

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full
        ${isScrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-md' 
          : 'bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-md'
        }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-4 px-4 md:px-0">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Stethoscope className={`h-8 w-8 ${isScrolled ? 'text-cyan-600' : 'text-cyan-400'}`} />
            <span className={`font-bold text-xl ${isScrolled ? 'bg-gradient-to-r from-cyan-600 to-blue-700' : 'bg-gradient-to-r from-cyan-400 to-blue-500'} bg-clip-text text-transparent hidden md:block`}>
              Clínica Dental Vargas Araya
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className={`font-medium ${isScrolled ? 'text-slate-700 hover:text-cyan-600' : 'text-slate-200 hover:text-cyan-300'} transition-colors`}>
              Inicio
            </Link>
            <Link href="/services" className={`font-medium ${isScrolled ? 'text-slate-700 hover:text-cyan-600' : 'text-slate-200 hover:text-cyan-300'} transition-colors`}>
              Servicios
            </Link>
            <Link href="/about" className={`font-medium ${isScrolled ? 'text-slate-700 hover:text-cyan-600' : 'text-slate-200 hover:text-cyan-300'} transition-colors`}>
              Acerca de
            </Link>
            <Link href="/contact" className={`font-medium ${isScrolled ? 'text-slate-700 hover:text-cyan-600' : 'text-slate-200 hover:text-cyan-300'} transition-colors`}>
              Contacto
            </Link>
          </nav>

          {/* User Menu or Login/Register Buttons */}
          <div className="flex items-center">
            {session ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="outline-none cursor-pointer">
                  <div className="flex gap-2 items-center group">
                    <Avatar className={`size-10 border-2 ${isScrolled ? 'border-cyan-500' : 'border-cyan-400'} group-hover:opacity-90 transition`}>
                      <AvatarImage
                        className="size-10"
                        src={undefined}
                        alt={session.user?.name || "Avatar"}
                      />
                      <AvatarFallback className={`${isScrolled ? 'bg-cyan-600' : 'bg-cyan-500'} text-white`}>
                        {avatarFallback}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`font-semibold ${isScrolled ? 'text-slate-700' : 'text-slate-200'} group-hover:text-cyan-400 transition hidden sm:block`}>
                      {session.user?.name}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="bottom" className="w-56 me-2 mt-2">
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user?.email}
                    </p>
                  </div>

                  <DropdownMenuSeparator />

                

                  <Link href="/profile" passHref>
                    <DropdownMenuItem
                      asChild
                      className="h-10 text-cyan-700 font-medium cursor-pointer"
                    >
                      <span>Perfil</span>
                    </DropdownMenuItem>
                  </Link>

                  {session.user?.role === "admin" && (
                    <>
                      <DropdownMenuItem
                        className="h-10 text-cyan-700 font-medium cursor-pointer"
                        onClick={() => router.push("/admin")}
                      >
                        Panel Administrador
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="h-10 text-cyan-700 font-medium cursor-pointer"
                        onClick={() => router.push("/admin/users")}
                      >
                        Gestión de usuarios
                      </DropdownMenuItem>
                    </>
                  )}

                  {session.user?.role === "doctor" && (
                    <>
                      <DropdownMenuItem
                        className="h-10 text-cyan-700 font-medium cursor-pointer"
                        onClick={() => router.push("/doctor")}
                      >
                        Panel Médico
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="h-10 text-cyan-700 font-medium cursor-pointer"
                        onClick={() => router.push("/doctor/calendar")}
                      >
                        Calendario
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="h-10 text-red-600 font-medium cursor-pointer"
                    onClick={handleSignOut}
                  >
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-3 md:gap-4">
                <Button
                  asChild
                  variant="outline"
                  className={`border ${isScrolled ? 'border-cyan-600 text-cyan-600 hover:bg-cyan-50' : 'border-cyan-400 text-cyan-400 hover:bg-cyan-900/20'} rounded-full px-4`}
                >
                  <Link href="/sign-in">Iniciar sesión</Link>
                </Button>
                <Button 
                  asChild 
                  className={`${isScrolled ? 'bg-gradient-to-r from-cyan-500 to-blue-600' : 'bg-gradient-to-r from-cyan-400 to-blue-500'} hover:opacity-90 text-white rounded-full px-4`}
                >
                  <Link href="/sign-up">Registrarse</Link>
                </Button>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              className="ml-4 md:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? 
                <X className={`h-6 w-6 ${isScrolled ? 'text-slate-700' : 'text-slate-200'}`} /> : 
                <Menu className={`h-6 w-6 ${isScrolled ? 'text-slate-700' : 'text-slate-200'}`} />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden ${isScrolled ? 'bg-white' : 'bg-slate-900'} py-4 px-4`}>
          <nav className="flex flex-col space-y-4">
            <Link 
              href="/" 
              className={`font-medium ${isScrolled ? 'text-slate-700 hover:text-cyan-600' : 'text-slate-200 hover:text-cyan-300'} transition-colors py-2 px-4 rounded-md ${isScrolled ? 'hover:bg-slate-100' : 'hover:bg-slate-800'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link 
              href="/services" 
              className={`font-medium ${isScrolled ? 'text-slate-700 hover:text-cyan-600' : 'text-slate-200 hover:text-cyan-300'} transition-colors py-2 px-4 rounded-md ${isScrolled ? 'hover:bg-slate-100' : 'hover:bg-slate-800'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Servicios
            </Link>
            <Link 
              href="/about" 
              className={`font-medium ${isScrolled ? 'text-slate-700 hover:text-cyan-600' : 'text-slate-200 hover:text-cyan-300'} transition-colors py-2 px-4 rounded-md ${isScrolled ? 'hover:bg-slate-100' : 'hover:bg-slate-800'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Acerca de
            </Link>
            <Link 
              href="/contact" 
              className={`font-medium ${isScrolled ? 'text-slate-700 hover:text-cyan-600' : 'text-slate-200 hover:text-cyan-300'} transition-colors py-2 px-4 rounded-md ${isScrolled ? 'hover:bg-slate-100' : 'hover:bg-slate-800'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contacto
            </Link>
            {session && (
              <Link 
                href="/profile" 
                className={`font-medium ${isScrolled ? 'text-slate-700 hover:text-cyan-600' : 'text-slate-200 hover:text-cyan-300'} transition-colors py-2 px-4 rounded-md ${isScrolled ? 'hover:bg-slate-100' : 'hover:bg-slate-800'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Mi Perfil
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>

  );
};

export default UserButton;
