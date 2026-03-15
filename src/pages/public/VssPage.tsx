import { useMemo } from 'react'
import { Link } from 'react-router'
import { UserPlus, Heart, GraduationCap } from 'lucide-react'
import PageHero from '../../components/public/PageHero'
import { Button, MapWidget, LoadingSpinner } from '../../components/ui'
import { useQuery } from '../../hooks/useQuery'
import { getStudents } from '../../lib/queries'
import { studentsToGroupedLocations } from '../../utils/mapHelpers'
import { NEPAL_BOUNDARY } from '../../data/nepal-boundary'
import studentSponsorshipImage from '../../assets/student-sponsorship.jpg'

const STEPS = [
  {
    num: 1,
    icon: UserPlus,
    title: 'Choose to Sponsor',
    description:
      'Your $150 per year covers tuition, uniforms, and school supplies for one child in Nepal.',
  },
  {
    num: 2,
    icon: Heart,
    title: 'Get Connected',
    description:
      'Receive updates and photos of your sponsored student throughout the year from local coordinators.',
  },
  {
    num: 3,
    icon: GraduationCap,
    title: 'Watch Them Grow',
    description:
      'Follow your student\'s progress as they build skills, confidence, and a brighter future.',
  },
]

const STATS = [
  { value: '160+', label: 'Students Currently Sponsored' },
  { value: '$150', label: 'Per Year, Per Child' },
  { value: '100%', label: 'Goes to Student Support' },
]

export default function VssPage() {
  const { data: students, loading: studentsLoading } = useQuery(
    () => getStudents('active'),
    [],
  )

  const mapLocations = useMemo(
    () => (students ? studentsToGroupedLocations(students) : []),
    [students],
  )

  return (
    <div>
      <PageHero
        title="Village Student Sponsorship"
        subtitle="Giving children access to education for just $150 a year."
      />

      {/* Program Overview */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl text-text-high mb-4">
              Education Changes Everything
            </h2>
            <div className="space-y-4 text-text-muted text-base leading-relaxed">
              <p>
                In remote villages across Nepal, many children lack access to
                basic education. Without school fees, uniforms, and supplies,
                they simply can't attend.
              </p>
              <p>
                The Village Student Sponsorship program partners with local
                Nepali coordinators who identify the students and communities
                with the greatest need. Your sponsorship covers tuition, school
                supplies, and uniforms — everything a child needs to
                stay in school.
              </p>
              <p>
                This isn't a top-down program. Local leaders guide every aspect,
                ensuring partnerships are culturally appropriate and sustainable
                for the long term.
              </p>
            </div>
          </div>
          <div className="rounded-xl aspect-[4/3] overflow-hidden shadow-lg">
            <img
              src={studentSponsorshipImage}
              alt="Village students in Nepal"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-accent-soft py-16 md:py-24">
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

      {/* Where We Serve */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl text-text-high text-center mb-4">
            Where We Serve
          </h2>
          <p className="text-text-muted text-center mb-8 max-w-2xl mx-auto text-base leading-relaxed">
            Each marker represents a village where HIS sponsors students.
            Toggle between terrain and street view to explore Nepal's landscape.
          </p>
          {studentsLoading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner />
            </div>
          ) : (
            <MapWidget
              locations={mapLocations}
              height="550px"
              cluster
              showControls
              geoJsonOverlay={{ data: NEPAL_BOUNDARY }}
            />
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary-soft py-16 text-center px-6">
        <h2 className="font-display text-3xl text-text-high mb-4">
          Ready to Change a Life?
        </h2>
        <p className="text-text-muted mb-8 max-w-lg mx-auto text-base leading-relaxed">
          For $150 a year, you can give a child in Nepal access to education
          and a future full of possibility.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://www.his-serve.org/give"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="accent">Sponsor a Student</Button>
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
