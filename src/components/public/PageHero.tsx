interface PageHeroProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export default function PageHero({ title, subtitle, children }: PageHeroProps) {
  return (
    <section className="bg-secondary-soft py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h1 className="font-display text-4xl md:text-5xl text-text-high mb-4">{title}</h1>
        {subtitle && (
          <p className="text-text-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  )
}
