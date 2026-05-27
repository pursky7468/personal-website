"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Moon, Sun, Menu, Languages } from "lucide-react"
import { useTheme } from "next-themes"
import { useTranslations, useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const t = useTranslations("nav")
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={t("toggleTheme")}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}

function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const other = locale === "zh-TW" ? "en" : "zh-TW"

  const switchLocale = () => {
    // Replace the locale prefix in the pathname
    const newPath = pathname.replace(`/${locale}`, `/${other}`) || `/${other}`
    router.push(newPath)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={switchLocale}
      className="text-xs font-medium text-muted-foreground hover:text-foreground gap-1"
      aria-label="Switch language"
    >
      <Languages className="h-3.5 w-3.5" />
      {other === "zh-TW" ? "中文" : "EN"}
    </Button>
  )
}

export function Navbar() {
  const t = useTranslations("nav")
  const locale = useLocale()
  const pathname = usePathname()

  const navLinks = [
    { href: `/${locale}/projects`, label: t("projects") },
    { href: `/${locale}/blog`, label: t("blog") },
    { href: `/${locale}/about`, label: t("about") },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href={`/${locale}`}
          className="font-semibold text-foreground hover:text-primary transition-colors"
        >
          Steve Lin
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors hover:text-primary",
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <LocaleSwitcher />
          <ThemeToggle />
        </div>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-1">
          <LocaleSwitcher />
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t("menu")}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{t("menu")}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-base transition-colors hover:text-primary",
                      pathname === link.href || pathname.startsWith(link.href + "/")
                        ? "text-primary font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
