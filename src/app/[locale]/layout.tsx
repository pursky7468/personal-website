import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { routing } from '@/i18n/routing'
import '../globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'meta' })
  return {
    title: {
      default: 'Steve Lin',
      template: '%s | Steve Lin',
    },
    description: t('siteDescription'),
    openGraph: {
      title: 'Steve Lin',
      description: t('siteDescription'),
      url: process.env.NEXT_PUBLIC_SITE_URL,
      siteName: 'Steve Lin',
      locale: params.locale === 'zh-TW' ? 'zh_TW' : 'en_US',
      type: 'website',
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!routing.locales.includes(params.locale as (typeof routing.locales)[number])) {
    notFound()
  }
  const messages = await getMessages()

  return (
    <html
      lang={params.locale}
      suppressHydrationWarning
      className={cn(inter.variable, jetbrainsMono.variable)}
    >
      <body className="min-h-screen bg-background text-foreground antialiased flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
