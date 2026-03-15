import { Link, useParams } from 'react-router'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import { LoadingSpinner } from '../../components/ui'
import { useQuery } from '../../hooks/useQuery'
import { getArticleBySlug } from '../../lib/queries'

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()

  const {
    data: article,
    loading,
    error,
  } = useQuery(() => getArticleBySlug(slug!), [slug])

  if (loading) {
    return (
      <div className="py-16 md:py-24">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
        <h1 className="font-display text-3xl text-text-high mb-4">
          Article Not Found
        </h1>
        <p className="text-text-muted mb-8">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/news"
          className="text-primary hover:underline inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to News
        </Link>
      </div>
    )
  }

  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  const authorName =
    article.author && typeof article.author === 'object'
      ? (article.author as { display_name?: string }).display_name
      : null

  const bodyText =
    typeof article.body === 'object' && article.body !== null
      ? (article.body as { text?: string }).text ?? ''
      : ''

  const paragraphs = bodyText
    .split('\n\n')
    .filter((p) => p.trim().length > 0)

  return (
    <div>
      {/* Header image */}
      {article.featured_image_url && (
        <div className="w-full h-64 md:h-80">
          <img
            src={article.featured_image_url}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Back link */}
        <Link
          to="/news"
          className="text-sm text-text-muted hover:text-primary inline-flex items-center gap-1.5 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to News
        </Link>

        {/* Title & meta */}
        <h1 className="font-display text-3xl md:text-4xl text-text-high mb-4">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-8 pb-8 border-b border-text-muted/10">
          {date && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {date}
            </span>
          )}
          {authorName && (
            <span className="inline-flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {authorName}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="prose prose-lg max-w-none">
          {paragraphs.length > 0 ? (
            paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-text-muted text-base leading-relaxed mb-4"
              >
                {p}
              </p>
            ))
          ) : (
            <p className="text-text-muted italic">
              This article has no content yet.
            </p>
          )}
        </div>
      </article>
    </div>
  )
}
