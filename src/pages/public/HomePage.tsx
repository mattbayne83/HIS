import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import {
  GraduationCap,
  Heart,
  Users,
  ChevronDown,
} from 'lucide-react'
import { Card, Button, MapWidget } from '../../components/ui'
import { NEPAL_BOUNDARY } from '../../data/nepal-boundary'
import heroBackground from '../../assets/hero-background.jpg'
import classroomScene from '../../assets/classroom-scene.jpg'

const GIVE_URL = 'https://www.his-serve.org/give'

const IMPACT_STATS = [
  { value: '160+', label: 'Children Sponsored', description: 'Students receiving education support across Nepal' },
  { value: '$24,000+', label: 'Total Annual Impact', description: 'Direct investment in student education each year' },
  { value: '25+', label: 'Unique Communities', description: 'Remote villages reached through sponsorships' },
]

const PROGRAMS = [
  {
    icon: GraduationCap,
    title: 'Village Student Sponsorship',
    story: 'She walks 90 minutes to school. You make sure she has shoes for the journey, a uniform to wear, and lunch when she arrives.',
    impact: '$150/year · 160+ students sponsored',
    link: '/student-sponsorship',
  },
  {
    icon: Heart,
    title: 'Women\'s Training',
    story: 'Six months of residential training in sewing, business, and confidence — transforming young women into skilled entrepreneurs.',
    impact: '260+ graduates · sustainable income',
    link: '/womens-training',
  },
  {
    icon: Users,
    title: 'Leadership Development',
    story: 'Local leaders equipped to serve their communities — because lasting change comes from within, not from outside.',
    impact: '150+ leaders · ripple effect across villages',
    link: '/our-story',
  },
]

export default function HomePage() {
  const [parallaxOffset, setParallaxOffset] = useState(0)

  useEffect(() => {
    // Parallax scroll effect for hero
    const handleScroll = () => {
      const scrolled = window.scrollY
      // Move background slower than scroll (0.5x speed for subtle parallax)
      setParallaxOffset(scrolled * 0.5)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div>
      {/* Hero - Immersive Storytelling */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-100 ease-out"
          style={{
            backgroundImage: `url(${heroBackground})`,
            transform: `translateY(${parallaxOffset}px)`,
            top: '-20%',
            height: '120%',
          }}
        />

        {/* Gradient Overlay - Depth & Drama */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#DC143C]/60 via-[#A67C52]/40 to-[#1F1812]/50" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          {/* Headline */}
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight">
            $150 Changes<br />Everything
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-4 leading-relaxed font-light">
            One year of education. Tuition, uniforms, and supplies.
          </p>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
            For a child in a remote Himali village, it's the difference between hope and survival.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a
              href={GIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="primary" className="shadow-2xl shadow-primary/40 hover:shadow-primary/60 px-12">
                Sponsor a Student — $150/year
              </Button>
            </a>
            <Link to="/student-sponsorship">
              <Button size="md" variant="ghost" className="text-white border border-white/30 hover:bg-white/10">
                Learn More →
              </Button>
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce">
            <ChevronDown className="w-8 h-8 mx-auto text-white/60" />
          </div>
        </div>
      </section>

      {/* Every Number Has a Name */}
      <section className="bg-gradient-to-b from-secondary-soft to-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl text-center text-text-high mb-4">
            Every Number Has a Name
          </h2>
          <p className="text-center text-text-muted mb-12 max-w-2xl mx-auto">
            Behind every statistic is a person — a student, a graduate, a family transformed.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Story Card 1 - Student */}
            <Card variant="glass-medium" interactive padding="lg">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-light mx-auto mb-4 flex items-center justify-center">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <p className="font-serif text-4xl text-primary mb-2">160+</p>
                <p className="font-semibold text-text-high mb-4">Students Sponsored</p>
                <p className="text-sm text-text-muted leading-relaxed">
                  Like the 12-year-old girl who now reads at grade level after two years of sponsored education. She dreams of becoming a teacher.
                </p>
              </div>
            </Card>

            {/* Story Card 2 - Graduate */}
            <Card variant="glass-medium" interactive padding="lg">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-secondary-light mx-auto mb-4 flex items-center justify-center">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <p className="font-serif text-4xl text-secondary mb-2">260+</p>
                <p className="font-semibold text-text-high mb-4">RTDC Graduates</p>
                <p className="text-sm text-text-muted leading-relaxed">
                  Women who arrived uncertain and left with sewing skills, confidence, and a source of income for their families.
                </p>
              </div>
            </Card>

            {/* Story Card 3 - Leader */}
            <Card variant="glass-medium" interactive padding="lg">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-accent-dark mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <p className="font-serif text-4xl text-accent-dark mb-2">150+</p>
                <p className="font-semibold text-text-high mb-4">Leaders Trained</p>
                <p className="text-sm text-text-muted leading-relaxed">
                  Local pastors, teachers, and organizers now equipped to serve their communities with skill and compassion.
                </p>
              </div>
            </Card>
          </div>

          {/* Timeline Callout */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-medium">
              <span className="font-serif text-2xl text-primary">2018</span>
              <span className="text-text-muted">·</span>
              <span className="text-sm text-text-muted">Year we started this journey together</span>
            </div>
          </div>
        </div>
      </section>

      {/* Collective Impact */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl text-center text-text-high mb-4">
            See Your Impact
          </h2>
          <p className="text-center text-text-muted mb-12 max-w-2xl mx-auto">
            Together, we're creating lasting change across Nepal — one student, one community at a time.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {IMPACT_STATS.map((stat) => (
              <Card key={stat.label} variant="glass-medium" padding="lg">
                <div className="text-center">
                  <p className="font-serif text-5xl text-primary mb-2">{stat.value}</p>
                  <p className="font-semibold text-text-high mb-4 text-lg">{stat.label}</p>
                  <p className="text-sm text-text-muted leading-relaxed">{stat.description}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <a href={GIVE_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="primary" className="shadow-lg">
                Sponsor a Student — $150/year
              </Button>
            </a>
            <p className="text-text-muted text-sm mt-4">
              100% of sponsorships go directly to student support
            </p>
          </div>
        </div>
      </section>

      {/* Mission Snapshot */}
      <section className="py-16 md:py-24 bg-accent-soft">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl aspect-[4/3] overflow-hidden shadow-lg">
            <img
              src={classroomScene}
              alt="Nepal classroom scene"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide mb-4">
              Our Approach
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-text-high mb-4 leading-tight">
              Local Leaders.<br />Lasting Change.
            </h2>
            <p className="text-text-muted text-base leading-relaxed mb-4">
              We don't parachute in with solutions. We partner with Nepali leaders who know their communities, understand the needs, and will be there long after we're gone.
            </p>
            <p className="text-text-muted text-base leading-relaxed mb-6">
              From village classrooms to women's training centers, every program is designed, led, and sustained by local partners. We facilitate. They transform.
            </p>
            <Link to="/our-story">
              <Button variant="secondary" className="shadow-md">Read Our Story</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Program Highlights */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl text-text-high text-center mb-4">
            How We Serve
          </h2>
          <p className="text-center text-text-muted mb-12 max-w-2xl mx-auto">
            Three programs. One mission: lasting transformation led by local partners.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {PROGRAMS.map((p) => (
              <Card key={p.title} variant="glass-medium" padding="lg" interactive>
                <div className="h-full flex flex-col">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary mb-4">
                    <p.icon className="w-8 h-8" />
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-xl text-text-high mb-4">
                    {p.title}
                  </h3>

                  {/* Story */}
                  <p className="text-text-muted text-sm leading-relaxed mb-4 flex-1">
                    {p.story}
                  </p>

                  {/* Impact */}
                  <p className="text-xs text-secondary font-semibold uppercase tracking-wide mb-4 border-t border-neutral-200 pt-4">
                    {p.impact}
                  </p>

                  {/* CTA */}
                  <Link
                    to={p.link}
                    className="focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-xl"
                  >
                    <Button size="sm" variant="secondary" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Where We Work */}
      <section className="bg-gradient-to-b from-white to-secondary-soft py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl text-text-high text-center mb-4">
            Stories Across Nepal
          </h2>
          <p className="text-text-muted text-center mb-8 max-w-2xl mx-auto text-base leading-relaxed">
            Serving communities across Nepal — from the Kathmandu Valley to remote mountain villages. The terrain is rugged, but hope reaches even the most remote places.
          </p>
          <MapWidget
            locations={[]}
            height="500px"
            showControls
            geoJsonOverlay={{ data: NEPAL_BOUNDARY }}
          />
        </div>
      </section>

      {/* Final CTA - Emotional Close */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background with subtle texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-secondary opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="font-serif text-3xl md:text-5xl mb-6 leading-tight">
            You Don't Have to Go to Nepal<br />to Change a Life There
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-4 leading-relaxed max-w-2xl mx-auto">
            But with just $150, you can give a child the gift of education for an entire year.
          </p>
          <p className="text-base md:text-lg text-white/75 mb-10 leading-relaxed max-w-xl mx-auto">
            You'll know their story. You'll see their progress. You'll be part of their transformation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a href={GIVE_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="accent" className="shadow-2xl shadow-black/30 hover:shadow-black/50">
                Start Sponsoring Today
              </Button>
            </a>
            <Link to="/student-sponsorship">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 shadow-xl">
                Learn How It Works
              </Button>
            </Link>
          </div>

          {/* Trust Badge - Simple */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <span className="text-sm text-white/80">100% of sponsorships go directly to students</span>
          </div>
        </div>
      </section>
    </div>
  )
}
