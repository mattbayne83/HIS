import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Save } from 'lucide-react'
import {
  Button,
  Input,
  Textarea,
  Card,
  LoadingSpinner,
} from '../../components/ui'
import { useQuery } from '../../hooks/useQuery'
import { getArticle, createArticle, updateArticle } from '../../lib/queries'
import { useAppStore } from '../../store/useAppStore'
import { slugify } from '../../utils/slug'

export default function ArticleEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAppStore((s) => s.user)
  const isNew = !id

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [body, setBody] = useState('')
  const [saving, setSaving] = useState(false)
  const [autoSlug, setAutoSlug] = useState(true)

  const { data: article, loading } = useQuery(
    () => (id ? getArticle(id) : Promise.resolve(null)),
    [id]
  )

  useEffect(() => {
    if (article) {
      setTitle(article.title)
      setSlug(article.slug)
      setExcerpt(article.excerpt ?? '')
      // body is jsonb — store as plain text for now
      const bodyText =
        typeof article.body === 'object' && article.body !== null
          ? (article.body as { text?: string }).text ?? ''
          : ''
      setBody(bodyText)
      setAutoSlug(false)
    }
  }, [article])

  function handleTitleChange(val: string) {
    setTitle(val)
    if (autoSlug) {
      setSlug(slugify(val))
    }
  }

  async function handleSave(asDraft?: boolean) {
    if (!title || !slug) return
    setSaving(true)
    try {
      const payload = {
        title,
        slug,
        excerpt: excerpt || null,
        body: { text: body },
        featured_image_url: article?.featured_image_url ?? null,
        status: asDraft ? ('draft' as const) : (article?.status ?? ('draft' as const)),
        published_at: article?.published_at ?? null,
        author_id: article?.author_id ?? user?.id ?? '',
      }

      if (id) {
        await updateArticle(id, payload)
      } else {
        await createArticle(payload)
      }

      navigate('/admin/articles')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save article')
    } finally {
      setSaving(false)
    }
  }

  async function handlePublish() {
    if (!title || !slug) return
    setSaving(true)
    try {
      const payload = {
        title,
        slug,
        excerpt: excerpt || null,
        body: { text: body },
        featured_image_url: article?.featured_image_url ?? null,
        status: 'published' as const,
        published_at: new Date().toISOString(),
        author_id: article?.author_id ?? user?.id ?? '',
      }

      if (id) {
        await updateArticle(id, payload)
      } else {
        await createArticle(payload)
      }

      navigate('/admin/articles')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to publish article')
    } finally {
      setSaving(false)
    }
  }

  if (loading && !isNew) {
    return (
      <div className="py-20">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/admin/articles')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-display font-semibold text-text-high">
          {isNew ? 'New Article' : 'Edit Article'}
        </h1>
      </div>

      <Card>
        <div className="space-y-4">
          <Input
            label="Title"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
          <Input
            label="Slug"
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value)
              setAutoSlug(false)
            }}
          />
          <Textarea
            label="Excerpt"
            placeholder="Brief summary for cards and previews"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
          />
          <Textarea
            label="Body"
            placeholder="Write the article content here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={16}
          />
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={() => navigate('/admin/articles')}>
          Cancel
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleSave(true)}
          loading={saving}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <Button onClick={handlePublish} loading={saving}>
          Publish
        </Button>
      </div>
    </div>
  )
}

export { ArticleEditorPage as Component }
