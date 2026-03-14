import { useNavigate } from 'react-router'
import { Plus } from 'lucide-react'
import {
  Button,
  Badge,
  DataTable,
  LoadingSpinner,
  Card,
} from '../../components/ui'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { useQuery } from '../../hooks/useQuery'
import { getArticles, updateArticle, deleteArticle } from '../../lib/queries'
import type { Article } from '../../types/database'
import { formatDateShort } from '../../utils/format'

export default function ArticlesPage() {
  const navigate = useNavigate()
  const { data: articles, loading, error, refetch } = useQuery(() => getArticles())

  async function togglePublish(article: Article) {
    try {
      if (article.status === 'draft') {
        await updateArticle(article.id, {
          status: 'published',
          published_at: new Date().toISOString(),
        })
      } else {
        await updateArticle(article.id, {
          status: 'draft',
          published_at: null,
        })
      }
      refetch()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update article')
    }
  }

  async function handleDelete(article: Article) {
    if (!confirm(`Delete "${article.title}"? This cannot be undone.`)) return
    try {
      await deleteArticle(article.id)
      refetch()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete article')
    }
  }

  const columns: DataTableColumn<Article>[] = [
    { key: 'title', label: 'Title', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (_, row) => (
        <Badge
          variant={row.status === 'published' ? 'success' : 'warning'}
          label={row.status}
        />
      ),
    },
    {
      key: 'author',
      label: 'Author',
      render: (_, row) => {
        const author = row.author as { display_name: string } | undefined
        return author?.display_name || '—'
      },
    },
    {
      key: 'created_at',
      label: 'Created',
      sortable: true,
      render: (val) => formatDateShort(val as string),
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => togglePublish(row)}
          >
            {row.status === 'draft' ? 'Publish' : 'Unpublish'}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(row)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-display font-semibold text-text-high">
          Articles
        </h1>
        <Button onClick={() => navigate('/admin/articles/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Article
        </Button>
      </div>

      {error && (
        <Card>
          <p className="text-danger">{error}</p>
        </Card>
      )}

      <DataTable
        columns={columns}
        data={articles ?? []}
        onRowClick={(row) =>
          navigate(`/admin/articles/${row.id}/edit`)
        }
        emptyMessage="No articles yet"
      />
    </div>
  )
}

export { ArticlesPage as Component }
