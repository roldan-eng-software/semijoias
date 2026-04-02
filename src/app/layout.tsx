import type { Metadata } from "next"
import { Playfair_Display, Lato, Cormorant_Garamond } from "next/font/google"
import "./globals.css"
import { GoogleAnalytics } from "@next/third-parties/google"
import { Header } from "@/components/store/Header"
import { CartProvider } from "@/components/store/CartProvider"
import { AuthProvider } from "@/components/auth/AuthProvider"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const lato = Lato({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  style: ["normal", "italic"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://simoesemijoias.com.br'),
  title: {
    default: "Simone Semijoias | Semi-joias Exclusivas Banhadas a Ouro 18k",
    template: "%s | Simone Semijoias",
  },
  description:
    "Semi-joias exclusivas para mulheres que amam se sentir únicas. Brincos, colares, anéis e pulseiras banhados a ouro 18k e prata 925. Frete grátis acima de R$199.",
  keywords: ["semi-joias", "joias", "ouro 18k", "prata 925", "brincos", "colares", "pulseiras", "anel", "pingente", "kits"],
  authors: [{ name: "Simone Semijoias" }],
  creator: "Simone Semijoias",
  publisher: "Simone Semijoias",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://simoesemijoias.com.br",
    siteName: "Simone Semijoias",
    title: "Simone Semijoias | Semi-joias Exclusivas Banhadas a Ouro 18k",
    description:
      "Semi-joias exclusivas para mulheres que amam se sentir únicas. Brincos, colares, anéis e pulseiras banhados a ouro 18k e prata 925.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Simone Semijoias - Semi-joias Exclusivas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Simone Semijoias | Semi-joias Exclusivas",
    description:
      "Semi-joias exclusivas para mulheres que amam se sentir únicas. Brincos, colares, anéis e pulseiras banhados a ouro 18k.",
    images: ["/og-image.png"],
    creator: "@simoesemijoias",
  },
  verification: {
    google: "google-site-verification-code",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${lato.variable} ${cormorant.variable} h-full antialiased`}
      suppressHydrationWarning={true}
    >
      <body className="flex min-h-full flex-col font-lato">
        <AuthProvider>
          <Header />
          <main className="flex-1 pt-20">{children}</main>
          <CartProvider />
        </AuthProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-Q8PP6YVNW4"} />
    </html>
  )
}
