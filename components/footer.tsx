import { MapPin, Phone, Mail, Globe } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold">Mimaar Associates</h3>
              <p className="text-sm opacity-90 tracking-wider">SUPPLY AND SERVICES</p>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Your trusted partner for construction, real estate, and architectural services in Islamabad.
            </p>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Our Services</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>Real Estate Consultant</li>
              <li>Builders and Developers</li>
              <li>Architectural Design</li>
              <li>Renovation</li>
              <li>Interior Design</li>
              <li>Building Materials</li>
              <li>Furnishing & Furniture</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <a href="#home" className="hover:opacity-100 transition-opacity">
                  Home
                </a>
              </li>
              <li>
                <a href="#services" className="hover:opacity-100 transition-opacity">
                  Services
                </a>
              </li>
              <li>
                <a href="#about" className="hover:opacity-100 transition-opacity">
                  About Us
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:opacity-100 transition-opacity">
                  Projects
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:opacity-100 transition-opacity">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="opacity-80">Office No. UG-100, Defence Residency Shops, DHA II, Islamabad</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="opacity-80">0300 527 4224</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="opacity-80">mimaarassociates@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 flex-shrink-0" />
                <span className="opacity-80">mimaarassociate.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm opacity-80">
            © 2024 Mimaar Associates. All rights reserved. | Professional Construction & Real Estate Services
          </p>
        </div>
      </div>
    </footer>
  )
}
