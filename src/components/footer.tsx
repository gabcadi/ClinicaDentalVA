"use client";

import Link from "next/link";
import { Stethoscope, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-800 text-white pt-16 pb-8 mt-0">
      <div className="container mx-auto px-4">
        {/* Footer Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Clinic Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="h-8 w-8 text-cyan-400" />
              <span className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Clínica Dental
              </span>
            </div>
            <p className="text-slate-300 mb-6">
              Tecnología de vanguardia, atención personalizada y resultados extraordinarios en el corazón de Costa Rica.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-slate-800 p-2 rounded-full hover:bg-cyan-900 transition-colors"
              >
                <Facebook className="h-5 w-5 text-cyan-400" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-slate-800 p-2 rounded-full hover:bg-cyan-900 transition-colors"
              >
                <Instagram className="h-5 w-5 text-cyan-400" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-slate-800 p-2 rounded-full hover:bg-cyan-900 transition-colors"
              >
                <Twitter className="h-5 w-5 text-cyan-400" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-300 hover:text-cyan-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-slate-300 hover:text-cyan-400 transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-cyan-400 transition-colors">
                  Acerca de nosotros
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-cyan-400 transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-slate-300 hover:text-cyan-400 transition-colors">
                  Mi Perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Servicios
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services#ortodoncia" className="text-slate-300 hover:text-cyan-400 transition-colors">
                  Ortodoncia
                </Link>
              </li>
              <li>
                <Link href="/services#blanqueamiento" className="text-slate-300 hover:text-cyan-400 transition-colors">
                  Blanqueamiento
                </Link>
              </li>
              <li>
                <Link href="/services#implantes" className="text-slate-300 hover:text-cyan-400 transition-colors">
                  Implantes Dentales
                </Link>
              </li>
              <li>
                <Link href="/services#estetica" className="text-slate-300 hover:text-cyan-400 transition-colors">
                  Estética Dental
                </Link>
              </li>
              <li>
                <Link href="/services#general" className="text-slate-300 hover:text-cyan-400 transition-colors">
                  Odontología General
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-cyan-400 mt-0.5" />
                <span className="text-slate-300">
                  Vargas Araya, San Pedro, <br />
                  San José, Costa Rica
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-cyan-400" />
                <a href="tel:+50622803030" className="text-slate-300 hover:text-cyan-400 transition-colors">
                  +(506) 2280-3030
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-cyan-400" />
                <a href="mailto:info@clinicadentalva.com" className="text-slate-300 hover:text-cyan-400 transition-colors">
                  info@clinicadentalva.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              &copy; {currentYear} Clínica Dental Vargas Araya. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">
                Políticas de Privacidad
              </Link>
              <Link href="/terms" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">
                Términos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
