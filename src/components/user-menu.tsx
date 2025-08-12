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
import { Loader, Menu, X } from "lucide-react";
import { ToothIcon } from "@/components/ui/tooth-icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";

const UserButton = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Cast seguro para acceder al rol extendido en la sesión (evita error TS si la augment no es recogida)
  const role = (session?.user as any)?.role as 'admin' | 'user' | 'doctor' | undefined;

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
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-[cubic-bezier(.4,.0,.2,1)] border-b h-16
        ${isScrolled
          ? 'bg-white/85 backdrop-blur-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.25)] border-slate-200/70'
          : 'bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_60%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_55%)] bg-slate-900/80 backdrop-blur-xl border-white/10'
        }`}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 h-full">
        <div className="flex items-center justify-between h-full gap-4">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 rounded-lg px-1 -mx-1 shrink-0">
            <span className="relative inline-flex items-center justify-center">
              <ToothIcon className={`h-8 w-8 transition-colors duration-300 ${isScrolled ? 'text-cyan-600 group-hover:text-cyan-500' : 'text-cyan-400 group-hover:text-cyan-300'}`} />
              <span className="absolute inset-0 rounded-full bg-cyan-400/0 group-hover:bg-cyan-400/10 transition-colors" />
            </span>
            <span className={`font-bold tracking-tight text-lg md:text-xl ${isScrolled ? 'bg-gradient-to-r from-cyan-600 via-cyan-700 to-blue-700' : 'bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500'} bg-clip-text text-transparent hidden md:block drop-shadow-sm`}>
              Clínica Dental Vargas Araya
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 h-full">
            {[
              { href: '/', label: 'Inicio' },
              { href: '/services', label: 'Servicios' },
              { href: '/about', label: 'Acerca de' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative font-medium text-sm tracking-wide px-1 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 rounded-md
                  ${isScrolled ? 'text-slate-700/90 hover:text-cyan-600' : 'text-slate-200/90 hover:text-cyan-300'} transition-colors`}
              >
                <span className="relative z-10">{link.label}</span>
                <span className={`absolute inset-x-1 -bottom-1 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out hidden md:block
                  ${isScrolled ? 'bg-gradient-to-r from-cyan-500/0 via-cyan-500/70 to-cyan-500/0' : 'bg-gradient-to-r from-cyan-300/0 via-cyan-300/80 to-cyan-300/0'}`}
                />
              </Link>
            ))}
          </nav>

          {/* User Menu or Login/Register Buttons */}
          <div className="flex items-center gap-4 shrink-0">
            {session ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="outline-none cursor-pointer">
                  <div className="flex gap-2 items-center group h-10">
                    <Avatar className={`size-10 border bg-gradient-to-br ${isScrolled ? 'from-cyan-600/20 to-blue-600/20 border-cyan-500/70' : 'from-cyan-500/15 to-blue-500/15 border-cyan-400/60'} group-hover:scale-[1.03] transition-all duration-300 shadow-sm shadow-cyan-900/30`}>
                      <AvatarImage
                        className="size-10"
                        src={undefined}
                        alt={session.user?.name || "Avatar"}
                      />
                      <AvatarFallback className={`${isScrolled ? 'bg-cyan-600/90' : 'bg-cyan-500/90'} text-white font-semibold tracking-wide` }>
                        {avatarFallback}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`font-semibold ${isScrolled ? 'text-slate-700' : 'text-slate-200'} group-hover:text-cyan-400 transition-colors hidden sm:block`}>
                      {session.user?.name}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="bottom" className="w-60 me-2 mt-2 rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-[0_12px_40px_-8px_rgba(0,0,0,0.35)] p-1 will-change-transform">
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
                      className="h-10 text-cyan-700 dark:text-cyan-300 font-medium cursor-pointer rounded-md hover:bg-cyan-100/70 dark:hover:bg-cyan-500/10 focus:bg-cyan-100 dark:focus:bg-cyan-500/10 focus-visible:outline-none transition-colors"
                    >
                      <span>Perfil</span>
                    </DropdownMenuItem>
                  </Link>

                  {role === "admin" && (
                    <>
                      <DropdownMenuItem
                        className="h-10 text-cyan-700 dark:text-cyan-300 font-medium cursor-pointer rounded-md hover:bg-cyan-100/70 dark:hover:bg-cyan-500/10 focus:bg-cyan-100 dark:focus:bg-cyan-500/10 focus-visible:outline-none transition-colors"
                        onClick={() => router.push("/admin")}
                      >
                        Panel Administrador
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="h-10 text-cyan-700 dark:text-cyan-300 font-medium cursor-pointer rounded-md hover:bg-cyan-100/70 dark:hover:bg-cyan-500/10 focus:bg-cyan-100 dark:focus:bg-cyan-500/10 focus-visible:outline-none transition-colors"
                        onClick={() => router.push("/admin/users")}
                      >
                        Gestión de usuarios
                      </DropdownMenuItem>
                    </>
                  )}

                  {role === "doctor" && (
                    <>
                      <DropdownMenuItem
                        className="h-10 text-cyan-700 dark:text-cyan-300 font-medium cursor-pointer rounded-md hover:bg-cyan-100/70 dark:hover:bg-cyan-500/10 focus:bg-cyan-100 dark:focus:bg-cyan-500/10 focus-visible:outline-none transition-colors"
                        onClick={() => router.push("/doctor")}
                      >
                        Panel Médico
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="h-10 text-cyan-700 dark:text-cyan-300 font-medium cursor-pointer rounded-md hover:bg-cyan-100/70 dark:hover:bg-cyan-500/10 focus:bg-cyan-100 dark:focus:bg-cyan-500/10 focus-visible:outline-none transition-colors"
                        onClick={() => router.push("/doctor/calendar")}
                      >
                        Calendario
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="h-10 text-red-600 dark:text-red-400 font-medium cursor-pointer rounded-md hover:bg-red-100/70 dark:hover:bg-red-500/10 focus:bg-red-100 dark:focus:bg-red-500/10 focus-visible:outline-none transition-colors"
                    onClick={handleSignOut}
                  >
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-3 md:gap-4 items-center h-10">
                <Button
                  asChild
                  variant="outline"
                  className={`relative overflow-hidden border group rounded-full px-5 h-10 text-sm font-medium tracking-wide transition-all
                    ${isScrolled ? 'border-cyan-600 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50' : 'border-cyan-400 text-cyan-300 hover:text-white hover:bg-cyan-500/10'}
                    focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:outline-none`}
                >
                  <Link href="/sign-in">Iniciar sesión</Link>
                </Button>
                <Button 
                  asChild 
                  className={`relative overflow-hidden rounded-full px-5 h-10 text-sm font-semibold tracking-wide shadow shadow-cyan-900/30 transition-all
                    ${isScrolled ? 'bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 hover:brightness-110' : 'bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:brightness-110'}
                    focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900`}
                >
                  <Link href="/sign-up">Registrarse</Link>
                </Button>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              className={`md:hidden inline-flex items-center justify-center rounded-md h-10 w-10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70
                ${isScrolled ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-800/60 text-slate-200'}
              `}
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
  <div className={`md:hidden ${isScrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/70' : 'bg-slate-900/90 backdrop-blur-md border-b border-white/10'} py-4 px-4 animate-slideDown mt-16` }>
          <nav className="flex flex-col space-y-1">
            <Link 
              href="/" 
              className={`font-medium ${isScrolled ? 'text-slate-700 hover:text-cyan-600 hover:bg-slate-100' : 'text-slate-200 hover:text-cyan-300 hover:bg-slate-800/60'} transition-colors py-2 px-4 rounded-lg`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link 
              href="/services" 
              className={`font-medium ${isScrolled ? 'text-slate-700 hover:text-cyan-600 hover:bg-slate-100' : 'text-slate-200 hover:text-cyan-300 hover:bg-slate-800/60'} transition-colors py-2 px-4 rounded-lg`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Servicios
            </Link>
            <Link 
              href="/about" 
              className={`font-medium ${isScrolled ? 'text-slate-700 hover:text-cyan-600 hover:bg-slate-100' : 'text-slate-200 hover:text-cyan-300 hover:bg-slate-800/60'} transition-colors py-2 px-4 rounded-lg`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Acerca de
            </Link>
            <Link 
              href="/contact" 
              className={`font-medium ${isScrolled ? 'text-slate-700 hover:text-cyan-600 hover:bg-slate-100' : 'text-slate-200 hover:text-cyan-300 hover:bg-slate-800/60'} transition-colors py-2 px-4 rounded-lg`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contacto
            </Link>
            {session && (
              <Link 
                href="/profile" 
                className={`font-medium ${isScrolled ? 'text-slate-700 hover:text-cyan-600 hover:bg-slate-100' : 'text-slate-200 hover:text-cyan-300 hover:bg-slate-800/60'} transition-colors py-2 px-4 rounded-lg`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Mi Perfil
              </Link>
            )}
          </nav>
        </div>
      )}
      <style jsx>{`
        @keyframes slideDown { from { opacity:0; transform: translateY(-8px); } to { opacity:1; transform: translateY(0);} }
        .animate-slideDown { animation: slideDown .45s cubic-bezier(.4,0,.2,1); }
      `}</style>
    </header>

  );
};

export default UserButton;
