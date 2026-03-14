import { useState } from 'react'
import { Heart, Users, Globe, Award, TrendingUp, CheckCircle2 } from 'lucide-react'

/**
 * DesignDemoPage — Glassmorphism Design System Showcase
 * Demonstrates Nepal flag crimson + glassmorphic UI patterns
 */
export function DesignDemoPage() {
  const [activeTab, setActiveTab] = useState<'colors' | 'components' | 'layouts'>('colors')

  return (
    <div className="min-h-screen">
      {/* Hero Section — Glassmorphic with Gradient Background */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#DC143C] via-[#E85472] to-[#A67C52]" />

        {/* Glass overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

        {/* Content */}
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <h1 className="text-6xl font-serif font-bold mb-4 drop-shadow-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
            Glassmorphism Design System
          </h1>
          <p className="text-xl font-sans max-w-2xl mx-auto mb-8 text-white/90">
            Premium Nepal flag crimson palette with frosted glass surfaces, elegant depth, and cultural dignity.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="bg-white/90 backdrop-blur-md text-[#DC143C] font-semibold px-8 py-4 rounded-xl border border-white/30 hover:bg-white hover:shadow-2xl transition-all duration-300">
              Primary Glass
            </button>
            <button className="bg-[#DC143C]/90 backdrop-blur-md text-white font-semibold px-8 py-4 rounded-xl border border-white/20 hover:bg-[#F04060]/95 hover:shadow-xl hover:shadow-[#DC143C]/20 transition-all duration-250">
              Crimson Glass
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-white/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 py-4">
            {(['colors', 'components', 'layouts'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-200 capitalize ${
                  activeTab === tab
                    ? 'bg-[#DC143C] text-white shadow-md'
                    : 'bg-white/40 text-neutral-700 hover:bg-white/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'colors' && <ColorPalette />}
        {activeTab === 'components' && <ComponentShowcase />}
        {activeTab === 'layouts' && <LayoutPatterns />}
      </div>
    </div>
  )
}

function ColorPalette() {
  return (
    <div className="space-y-12">
      {/* Primary Colors */}
      <section>
        <h2 className="text-3xl font-serif font-semibold mb-6 text-neutral-800" style={{ fontFamily: 'Playfair Display, serif' }}>
          Primary — Crimson Red
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ColorSwatch color="#DC143C" name="Crimson" role="Primary" />
          <ColorSwatch color="#E85472" name="Rose" role="Light" />
          <ColorSwatch color="#A01028" name="Burgundy" role="Dark" />
          <ColorSwatch color="#FCEEF2" name="Blush" role="Soft" textDark />
        </div>
      </section>

      {/* Secondary Colors */}
      <section>
        <h2 className="text-3xl font-serif font-semibold mb-6 text-neutral-800" style={{ fontFamily: 'Playfair Display, serif' }}>
          Secondary — Mountain Bronze (Analogous)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ColorSwatch color="#A67C52" name="Bronze" role="Secondary" />
          <ColorSwatch color="#C9A77C" name="Golden Sand" role="Light" textDark />
          <ColorSwatch color="#7D5938" name="Umber" role="Dark" />
          <ColorSwatch color="#F5EFE0" name="Warm Cream" role="Soft" textDark />
        </div>
      </section>

      {/* Accent */}
      <section>
        <h2 className="text-3xl font-serif font-semibold mb-6 text-neutral-800" style={{ fontFamily: 'Playfair Display, serif' }}>
          Accent — Warm Sand
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ColorSwatch color="#D4C5B0" name="Sand" role="Accent" textDark />
          <ColorSwatch color="#A89680" name="Taupe" role="Dark" textDark />
          <ColorSwatch color="#F5F1EB" name="Cream" role="Soft" textDark />
        </div>
      </section>

      {/* Semantic */}
      <section>
        <h2 className="text-3xl font-serif font-semibold mb-6 text-neutral-800" style={{ fontFamily: 'Playfair Display, serif' }}>
          Semantic Colors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ColorSwatch color="#2D6A4F" name="Success" role="Positive states" />
          <ColorSwatch color="#F59E0B" name="Warning" role="Caution" />
          <ColorSwatch color="#DC2626" name="Error" role="Destructive" />
          <ColorSwatch color="#0066CC" name="Info" role="Informational" />
        </div>
      </section>
    </div>
  )
}

function ComponentShowcase() {
  return (
    <div className="space-y-12">
      {/* Buttons */}
      <section>
        <h2 className="text-3xl font-serif font-semibold mb-6 text-neutral-800" style={{ fontFamily: 'Playfair Display, serif' }}>
          Buttons
        </h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-[#DC143C] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#F04060] hover:shadow-lg hover:shadow-[#DC143C]/25 active:bg-[#B01030] transition-all duration-250">
            Primary Crimson
          </button>
          <button className="bg-[#A67C52] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#C9A77C] hover:shadow-md transition-all duration-250">
            Secondary Bronze
          </button>
          <button className="bg-white/40 backdrop-blur-sm text-[#DC143C] font-semibold px-6 py-3 rounded-xl border border-white/30 hover:bg-white/60 hover:border-[#DC143C]/30 hover:shadow-md transition-all duration-250">
            Ghost Glass
          </button>
          <button className="bg-transparent border-2 border-[#DC143C] text-[#DC143C] font-semibold px-6 py-3 rounded-xl hover:bg-[#FFE8ED] transition-all duration-250">
            Outline
          </button>
          <button className="bg-[#DC2626] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#EF4444] hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200">
            Danger
          </button>
        </div>
      </section>

      {/* Cards */}
      <section>
        <h2 className="text-3xl font-serif font-semibold mb-6 text-neutral-800" style={{ fontFamily: 'Playfair Display, serif' }}>
          Glass Cards
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Standard Glass Card */}
          <div className="bg-white/85 backdrop-blur-md border border-white/20 rounded-2xl shadow-md p-6 hover:shadow-lg hover:bg-white/90 transition-all duration-300">
            <Heart className="w-8 h-8 text-[#DC143C] mb-4" />
            <h3 className="text-xl font-serif font-semibold mb-2 text-neutral-800">Standard Glass</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              85% opacity, 16px blur, subtle shadow. Perfect for content cards and information displays.
            </p>
          </div>

          {/* Interactive Glass Card */}
          <div className="bg-white/75 backdrop-blur-md border border-white/25 rounded-2xl shadow-sm p-6 cursor-pointer hover:bg-white/90 hover:shadow-xl hover:border-[#DC143C]/20 hover:-translate-y-1 transition-all duration-300">
            <Users className="w-8 h-8 text-[#A67C52] mb-4" />
            <h3 className="text-xl font-serif font-semibold mb-2 text-neutral-800">Interactive</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Hover effect with lift, border color shift, enhanced shadow. Great for clickable cards.
            </p>
          </div>

          {/* Crimson Accent Glass Card */}
          <div className="bg-gradient-to-br from-white/90 to-[#FCEEF2]/50 backdrop-blur-lg border-t border-l border-white/40 border-r border-b border-[#DC143C]/10 rounded-2xl shadow-lg p-6">
            <Award className="w-8 h-8 text-[#D4C5B0] mb-4" />
            <h3 className="text-xl font-serif font-semibold mb-2 text-neutral-800">Crimson Accent</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Gradient tint, asymmetric borders, heavy blur. Premium features and highlighted content.
            </p>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section>
        <h2 className="text-3xl font-serif font-semibold mb-6 text-neutral-800" style={{ fontFamily: 'Playfair Display, serif' }}>
          Glass Badges
        </h2>
        <div className="flex flex-wrap gap-3">
          <span className="bg-[#2D6A4F]/15 backdrop-blur-sm border border-[#2D6A4F]/25 text-[#2D6A4F] px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
            Success
          </span>
          <span className="bg-[#F59E0B]/15 backdrop-blur-sm border border-[#F59E0B]/25 text-[#D97706] px-3 py-1 rounded-full text-xs font-semibold">
            Warning
          </span>
          <span className="bg-[#DC2626]/15 backdrop-blur-sm border border-[#DC2626]/25 text-[#DC2626] px-3 py-1 rounded-full text-xs font-semibold">
            Danger
          </span>
          <span className="bg-neutral-200/60 backdrop-blur-sm border border-neutral-300/40 text-neutral-600 px-3 py-1 rounded-full text-xs font-medium">
            Neutral
          </span>
          <span className="bg-[#DC143C]/15 backdrop-blur-sm border border-[#DC143C]/25 text-[#DC143C] px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </span>
        </div>
      </section>

      {/* Inputs */}
      <section>
        <h2 className="text-3xl font-serif font-semibold mb-6 text-neutral-800" style={{ fontFamily: 'Playfair Display, serif' }}>
          Glass Inputs
        </h2>
        <div className="max-w-md space-y-4">
          <input
            type="text"
            placeholder="Glass input — default state"
            className="w-full bg-white/60 backdrop-blur-sm border border-white/40 rounded-lg px-4 py-3 text-neutral-700 text-sm placeholder:text-neutral-400 focus:bg-white/80 focus:ring-2 focus:ring-[#DC143C]/30 focus:border-[#DC143C]/50 outline-none transition-all duration-200"
          />
          <input
            type="text"
            placeholder="Solid input — high contrast"
            className="w-full bg-white border border-neutral-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#DC143C]/20 focus:border-[#DC143C] outline-none transition-all duration-200"
          />
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="text-3xl font-serif font-semibold mb-6 text-neutral-800" style={{ fontFamily: 'Playfair Display, serif' }}>
          Typography Scale
        </h2>
        <div className="space-y-4 bg-white/85 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h1 className="text-6xl font-semibold leading-tight tracking-tight text-neutral-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Hero Display
          </h1>
          <h2 className="text-5xl font-bold leading-tight text-neutral-800" style={{ fontFamily: 'Playfair Display, serif' }}>
            Display Heading
          </h2>
          <h3 className="text-4xl font-bold leading-snug text-neutral-800" style={{ fontFamily: 'Playfair Display, serif' }}>
            H1 Heading
          </h3>
          <h4 className="text-3xl font-semibold text-neutral-800" style={{ fontFamily: 'Playfair Display, serif' }}>
            H2 Heading
          </h4>
          <h5 className="text-2xl font-semibold text-neutral-800" style={{ fontFamily: 'Playfair Display, serif' }}>
            H3 Heading
          </h5>
          <p className="text-lg leading-relaxed text-neutral-600">
            Body Large — Inter regular, 18px, leading relaxed. Ideal for introductory paragraphs and featured content.
          </p>
          <p className="text-base leading-normal text-neutral-600">
            Body — Inter regular, 16px, line-height 1.6. Standard body text for articles, descriptions, and general content.
          </p>
          <p className="text-sm leading-snug text-neutral-600">
            Body Small — Inter regular, 14px. Suitable for secondary information, captions, and supporting text.
          </p>
          <p className="text-xs font-medium tracking-wide uppercase text-neutral-500">
            Caption — Inter medium, 12px, uppercase
          </p>
        </div>
      </section>
    </div>
  )
}

function LayoutPatterns() {
  return (
    <div className="space-y-12">
      {/* Bento Grid */}
      <section>
        <h2 className="text-3xl font-serif font-semibold mb-6 text-neutral-800" style={{ fontFamily: 'Playfair Display, serif' }}>
          Bento Grid — Glass Tiles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Globe, title: 'Global Reach', stat: '42 Villages', color: '#DC143C' },
            { icon: Users, title: 'Students Served', stat: '1,200+', color: '#A67C52' },
            { icon: TrendingUp, title: 'Growth Rate', stat: '+35%', color: '#D4C5B0' },
            { icon: Heart, title: 'Donors', stat: '850', color: '#DC143C' },
            { icon: Award, title: 'Programs', stat: '12 Active', color: '#2D6A4F' },
            { icon: CheckCircle2, title: 'Completion', stat: '94%', color: '#A67C52' },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/75 backdrop-blur-md border border-white/25 rounded-2xl p-6 hover:bg-white/90 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <item.icon className="w-10 h-10 mb-4" style={{ color: item.color }} />
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-1">
                {item.title}
              </h3>
              <p className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: item.color }}>
                {item.stat}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Cards Stack */}
      <section>
        <h2 className="text-3xl font-serif font-semibold mb-6 text-neutral-800" style={{ fontFamily: 'Playfair Display, serif' }}>
          Floating Cards Stack
        </h2>
        <div className="relative max-w-xl mx-auto" style={{ height: '320px' }}>
          {/* Card 3 (back) */}
          <div className="absolute top-8 left-4 right-4 bg-white/50 backdrop-blur-sm rounded-2xl h-64 transform rotate-2 shadow-md" />

          {/* Card 2 (middle) */}
          <div className="absolute top-4 left-2 right-2 bg-white/70 backdrop-blur-md rounded-2xl h-64 transform rotate-1 shadow-lg" />

          {/* Card 1 (front) */}
          <div className="relative bg-white/90 backdrop-blur-lg border border-white/30 rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-serif font-semibold mb-4 text-neutral-800" style={{ fontFamily: 'Playfair Display, serif' }}>
              Layered Depth
            </h3>
            <p className="text-neutral-600 leading-relaxed mb-6">
              Stacked glass cards create a sense of depth through rotation, blur intensity, and shadow layering.
              Each layer has decreasing opacity moving backward.
            </p>
            <button className="bg-[#DC143C] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#F04060] hover:shadow-lg transition-all duration-250">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Feature Section with Background */}
      <section className="relative rounded-3xl overflow-hidden p-12" style={{ minHeight: '400px' }}>
        {/* Background gradient */}
        <div class="absolute inset-0 bg-gradient-to-br from-[#A67C52] via-[#C9A77C] to-[#DC143C]" />

        {/* Glass overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

        {/* Content */}
        <div className="relative z-10 text-white max-w-2xl">
          <h2 className="text-4xl font-serif font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Glass on Gradient
          </h2>
          <p className="text-lg mb-6 text-white/90 leading-relaxed">
            Glassmorphism shines when placed over gradients or imagery. The blur effect becomes visible
            only when there's contrast behind it. White backgrounds kill the effect.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-4">
              <h4 className="font-semibold mb-2">Light Glass</h4>
              <p className="text-sm text-white/80">20% opacity, medium blur</p>
            </div>
            <div className="bg-white/30 backdrop-blur-lg border border-white/40 rounded-xl p-4">
              <h4 className="font-semibold mb-2">Medium Glass</h4>
              <p className="text-sm text-white/80">30% opacity, heavy blur</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ColorSwatch({
  color,
  name,
  role,
  textDark = false,
}: {
  color: string
  name: string
  role: string
  textDark?: boolean
}) {
  return (
    <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-white/20 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="h-32" style={{ backgroundColor: color }} />
      <div className="p-4">
        <h3 className={`font-semibold text-sm mb-1 ${textDark ? 'text-neutral-800' : ''}`}>
          {name}
        </h3>
        <p className="text-xs text-neutral-500 mb-2">{role}</p>
        <code className="text-xs font-mono bg-neutral-100 px-2 py-1 rounded text-neutral-700">
          {color}
        </code>
      </div>
    </div>
  )
}

export { DesignDemoPage as Component }
