import type { Metadata } from "next"
import { Playfair_Display, Lato, Cormorant_Garamond } from "next/font/google"
import "./globals.css"
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
  title: "Simone Semi Joias",
  description:
    "Semi-joias exclusivas para mulheres que amam se sentir únicas. Brincos, colares, anéis e pulseiras banhados a ouro 18k.",
  keywords: ["semi-joias", "joias", "ouro 18k", "prata 925", "brincos", "colares", "pulseiras"],
  icons: {
    icon: "/favicon.ico",
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
    </html>
  )
}
