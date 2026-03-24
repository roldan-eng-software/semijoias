import Link from "next/link"
import { Heart, Mail, Star } from "lucide-react"

const footerLinks = {
  collections: [
    { href: "/produtos?category=brincos", label: "Brincos" },
    { href: "/produtos?category=colares", label: "Colares" },
    { href: "/produtos?category=aneis", label: "Anéis" },
    { href: "/produtos?category=pulseiras", label: "Pulseiras" },
  ],
  institucional: [
    { href: "/sobre", label: "Sobre nós" },
    { href: "/privacidade", label: "Política de Privacidade" },
    { href: "/termos", label: "Termos de Uso" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-champagne bg-ivory">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="font-playfair text-xl md:text-2xl font-semibold text-dark-plum"
            >
              Simone Semi Joias
            </Link>
            <p className="text-sm leading-relaxed text-muted-mauve">
              Semi-joias exclusivas para mulheres que amam se sentir
              únicas. Qualidade premium com acabamento perfeito.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-plum hover:text-rose-gold"
                aria-label="Instagram"
              >
                <Heart className="h-5 w-5" />
              </a>
              <a
                href="mailto:contato@simone.com.br"
                className="text-dark-plum hover:text-rose-gold"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-plum hover:text-rose-gold"
                aria-label="LinkedIn"
              >
                <Star className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="mb-3 md:mb-4 font-lato text-sm font-bold uppercase tracking-wide text-dark-plum">
              Coleções
            </h4>
            <ul className="space-y-2">
              {footerLinks.collections.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-mauve transition-colors hover:text-rose-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institucional */}
          <div>
            <h4 className="mb-3 md:mb-4 font-lato text-sm font-bold uppercase tracking-wide text-dark-plum">
              Institucional
            </h4>
            <ul className="space-y-2">
              {footerLinks.institucional.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-mauve transition-colors hover:text-rose-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payments */}
          <div>
            <h4 className="mb-3 md:mb-4 font-lato text-sm font-bold uppercase tracking-wide text-dark-plum">
              Pagamentos
            </h4>
            <div className="flex flex-wrap gap-2">
              {["PIX", "Visa", "Master", "Boleto"].map((payment) => (
                <span
                  key={payment}
                  className="rounded-md bg-champagne px-2 md:px-3 py-1 text-xs font-medium text-muted-mauve"
                >
                  {payment}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-12 border-t border-champagne pt-6 md:pt-8 text-center text-sm text-muted-mauve">
          <p>© {new Date().getFullYear()} Simone Semi Joias. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
