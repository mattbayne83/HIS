import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  Button,
  Input,
  Select,
  Textarea,
  Modal,
  Badge,
  DataTable,
  LoadingSpinner,
  Card,
} from '../../components/ui'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { useQuery } from '../../hooks/useQuery'
import {
  getMinistries,
  createMinistry,
  updateMinistry,
  deleteMinistry,
} from '../../lib/queries'
import type { Ministry, ContentStatus } from '../../types/database'
import { slugify } from '../../utils/slug'

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
]

type MinistryFormData = {
  name: string
  slug: string
  description: string
  region: string
  status: ContentStatus
  sort_order: string
}

const emptyForm: MinistryFormData = {
  name: '',
  slug: '',
  description: '',
  region: '',
  status: 'draft',
  sort_order: '0',
}

export default function MinistriesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMinistry, setEditingMinistry] = useState<Ministry | null>(null)
  const [form, setForm] = useState<MinistryFormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [autoSlug, setAutoSlug] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<Ministry | null>(null)

  const { data: ministries, loading, error, refetch } = useQuery(() => getMinistries())

  const columns: DataTableColumn<Ministry>[] = [
    {
      key: 'sort_order',
      label: '#',
      sortable: true,
    },
    { key: 'name', label: 'Name', sortable: true },
    {
      key: 'region',
      label: 'Region',
      render: (val) => (val as string) || '—',
    },
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
  ]

  function openCreate() {
    setEditingMinistry(null)
    setForm(emptyForm)
    setAutoSlug(true)
    setModalOpen(true)
  }

  function openEdit(ministry: Ministry) {
    setEditingMinistry(ministry)
    setForm({
      name: ministry.name,
      slug: ministry.slug,
      description: ministry.description,
      region: ministry.region ?? '',
      status: ministry.status,
      sort_order: String(ministry.sort_order),
    })
    setAutoSlug(false)
    setModalOpen(true)
  }

  function handleNameChange(val: string) {
    setForm((f) => ({
      ...f,
      name: val,
      ...(autoSlug ? { slug: slugify(val) } : {}),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description,
        region: form.region || null,
        featured_image_url: editingMinistry?.featured_image_url ?? null,
        status: form.status,
        sort_order: parseInt(form.sort_order, 10) || 0,
      }

      if (editingMinistry) {
        await updateMinistry(editingMinistry.id, payload)
      } else {
        await createMinistry(payload)
      }

      setModalOpen(false)
      refetch()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save ministry')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteConfirm) return
    try {
      await deleteMinistry(deleteConfirm.id)
      setDeleteConfirm(null)
      refetch()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete ministry')
    }
  }

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
          Ministries
        </h1>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Ministry
        </Button>
      </div>

      {error && (
        <Card>
          <p className="text-danger">{error}</p>
        </Card>
      )}

      <DataTable
        columns={columns}
        data={ministries ?? []}
        onRowClick={(row) => openEdit(row)}
        emptyMessage="No ministries yet"
      />

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingMinistry ? 'Edit Ministry' : 'Add Ministry'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            required
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
          />
          <Input
            label="Slug"
            required
            value={form.slug}
            onChange={(e) => {
              setForm((f) => ({ ...f, slug: e.target.value }))
              setAutoSlug(false)
            }}
          />
          <Textarea
            label="Description"
            required
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            rows={4}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Region"
              value={form.region}
              onChange={(e) =>
                setForm((f) => ({ ...f, region: e.target.value }))
              }
            />
            <Select
              label="Status"
              options={STATUS_OPTIONS}
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  status: e.target.value as ContentStatus,
                }))
              }
            />
            <Input
              label="Sort Order"
              type="number"
              value={form.sort_order}
              onChange={(e) =>
                setForm((f) => ({ ...f, sort_order: e.target.value }))
              }
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              {editingMinistry && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setModalOpen(false)
                    setDeleteConfirm(editingMinistry)
                  }}
                >
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                {editingMinistry ? 'Save Changes' : 'Add Ministry'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Ministry"
        size="sm"
      >
        <p className="text-text-high mb-6">
          Are you sure you want to delete{' '}
          <strong>{deleteConfirm?.name}</strong>?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export { MinistriesPage as Component }
