import { AnimateIn } from "@/components/AnimateIn"

export function HeroSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <AnimateIn>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Steve Lin
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl">
            Automation engineer. 9 years integrating robots, vision systems, and industrial hardware. Now exploring where AI fits in the stack — and where it doesn&apos;t.
          </p>
        </AnimateIn>
      </div>
    </section>
  )
}
