import { Handshake, Sprout, Heart, GraduationCap, Gift, HandHeart } from 'lucide-react'
import PageHero from '../../components/public/PageHero'
import { Card, Button } from '../../components/ui'
import aboutTeamImage from '../../assets/about-team.jpg'

const GIVE_URL = 'https://www.his-serve.org/give'

const VALUES = [
  {
    icon: Handshake,
    title: 'Local Partnership',
    description:
      'We work through indigenous leaders who understand their communities — never around them. Every initiative is guided by those closest to the need.',
  },
  {
    icon: Sprout,
    title: 'Sustainable Impact',
    description:
      'Our programs are designed to outlast our involvement. We invest in people and systems that continue growing long after initial support.',
  },
  {
    icon: Heart,
    title: 'Whole-Person Care',
    description:
      'We address physical, emotional, and spiritual well-being because lasting transformation touches every part of a person\'s life.',
  },
]

const STATS = [
  { value: '260+', label: 'RTDC Graduates' },
  { value: '160+', label: 'Students Sponsored' },
  { value: '150+', label: 'Leaders Trained' },
  { value: '2018', label: 'Year Founded' },
]

const WAYS_TO_GIVE = [
  {
    icon: GraduationCap,
    title: 'Sponsor a Student',
    detail: '$150/year covers tuition, uniforms, and supplies for one child.',
  },
  {
    icon: Heart,
    title: 'RTDC Women\'s Program',
    detail: '$1,000 supports one young woman through our 16-week training center.',
  },
  {
    icon: Gift,
    title: 'Christmas Fund',
    detail: 'Any amount brings Christmas joy to nearly 2,000 children each year.',
  },
  {
    icon: HandHeart,
    title: 'General Fund',
    detail: 'Give where the need is greatest — your gift enables HIS to respond quickly.',
  },
]

export default function AboutPage() {
  return (
    <div>
      <PageHero
        title="Our Story"
        subtitle="Facilitating transformation in Nepal through local partnerships and sustainable programs since 2018."
      />

      {/* Mission Statement */}
      <section className="py-16 md:py-24 px-6">
        <blockquote className="max-w-3xl mx-auto text-center">
          <p className="font-display text-2xl md:text-3xl text-text-high leading-relaxed">
            "Our mission is to facilitate the work of God in Asia by investing
            resources of time, monies, and energies directly into programs that
            enhance the physical, emotional, and spiritual well-being of the
            local peoples."
          </p>
        </blockquote>
      </section>

      {/* Our Story */}
      <section className="bg-accent-soft py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl text-text-high mb-4">
              How It Started
            </h2>
            <div className="space-y-4 text-text-muted text-base leading-relaxed">
              <p>
                Himali Indigenous Services was founded in 2018 as a 501(c)(3)
                non-profit based in Cookeville, Tennessee. What began as a deep
                connection with the people of Nepal has grown into a network of
                programs reaching hundreds of lives each year.
              </p>
              <p>
                We partner directly with local Nepali leaders — pastors,
                teachers, and community organizers — who know their communities
                best. This approach ensures that every dollar invested creates
                real, culturally appropriate impact.
              </p>
              <p>
                From educating children through our Village Student Sponsorship
                program to empowering young women through vocational training, we
                believe lasting change comes from investing in people.
              </p>
            </div>
          </div>
          <div className="rounded-xl aspect-[4/3] overflow-hidden shadow-lg">
            <img
              src={aboutTeamImage}
              alt="HIS team and local partners in Nepal"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl text-text-high text-center mb-10">
            What We Believe
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {VALUES.map((v) => (
              <Card key={v.title} padding="lg">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary-soft text-secondary mb-4">
                    <v.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl text-text-high mb-2">
                    {v.title}
                  </h3>
                  <p className="text-text-muted text-base leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-secondary-soft py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-4xl md:text-5xl text-secondary tracking-tight mb-1">
                  {s.value}
                </p>
                <p className="text-sm text-text-muted font-medium uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ways to Support */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl text-text-high text-center mb-10">
            Ways to Support
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {WAYS_TO_GIVE.map((w) => (
              <Card key={w.title} padding="md">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-secondary-soft flex items-center justify-center text-secondary">
                    <w.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-text-high mb-1">
                      {w.title}
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed">
                      {w.detail}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href={GIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="accent">Give Now</Button>
            </a>
            <p className="text-text-muted text-sm mt-4">
              All donations are tax-deductible. HIS is a registered 501(c)(3).
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
