import { Link } from 'react-router'
import { ImageIcon, UserPlus, Sparkles, Award } from 'lucide-react'
import PageHero from '../../components/public/PageHero'
import { Button, MapWidget } from '../../components/ui'
import { NEPAL_BOUNDARY } from '../../data/nepal-boundary'

const GIVE_URL = 'https://www.his-serve.org/give'

const STEPS = [
  {
    num: 1,
    icon: UserPlus,
    title: 'Apply & Enroll',
    description:
      'Young women apply for the residential training program covering sewing, life skills, and vocational development.',
  },
  {
    num: 2,
    icon: Sparkles,
    title: 'Learn & Grow',
    description:
      'Students receive training in industrial sewing, financial literacy, health education, and personal development.',
  },
  {
    num: 3,
    icon: Award,
    title: 'Graduate & Thrive',
    description:
      'Graduates receive certification, job placement assistance, and ongoing mentorship to build independent livelihoods.',
  },
]

const STATS = [
  { value: '260+', label: 'RTDC Graduates' },
  { value: '$1,000', label: 'Per Woman Trained' },
  { value: '85%', label: 'Employment Rate' },
]

export default function WomensTrainingPage() {
  return (
    <div>
      <PageHero
        title="Women's Training"
        subtitle="Equipping women with the skills and confidence to build independent livelihoods."
      />

      {/* Program Overview */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl text-text-high mb-4">
              A Path to Independence
            </h2>
            <div className="space-y-4 text-text-muted text-base leading-relaxed">
              <p>
                In many communities across Nepal, young women face limited
                economic opportunity. Without practical skills or resources,
                breaking cycles of poverty is nearly impossible.
              </p>
              <p>
                The RTDC Women&apos;s Training program provides a residential
                learning environment where women gain professional sewing
                skills, financial literacy, and the confidence to support
                themselves and their families.
              </p>
              <p>
                For $1,000, you can sponsor a woman through the entire
                program — covering training, materials, room and board, and
                certification. It&apos;s an investment that transforms not just
                one life, but her family and community.
              </p>
            </div>
          </div>
          <div className="bg-surface-alt rounded-xl aspect-[4/3] flex items-center justify-center text-text-muted">
            <div className="text-center">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <span className="text-sm">Photo coming soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-accent-soft py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl text-text-high text-center mb-10">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.num} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary text-white mb-4">
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl text-text-high mb-2">
                  {step.title}
                </h3>
                <p className="text-text-muted text-base leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-6">
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

      {/* Where We Train */}
      <section className="bg-surface py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl text-text-high text-center mb-3">
            Where We Train
          </h2>
          <p className="text-text-muted text-center mb-8 max-w-2xl mx-auto text-base leading-relaxed">
            Our training centers partner with communities across Nepal to
            reach women who need these skills the most.
          </p>
          <MapWidget
            locations={[]}
            height="450px"
            showControls
            cluster={false}
            geoJsonOverlay={{ data: NEPAL_BOUNDARY }}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary-soft py-16 text-center px-6">
        <h2 className="font-display text-3xl text-text-high mb-4">
          Invest in a Woman&apos;s Future
        </h2>
        <p className="text-text-muted mb-8 max-w-lg mx-auto text-base leading-relaxed">
          For $1,000, you can sponsor a woman through the entire training
          program — giving her the skills to build an independent livelihood.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={GIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="accent">Support a Woman&apos;s Training</Button>
          </a>
          <Link to="/our-story">
            <Button variant="secondary" size="lg">
              Our Story
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
