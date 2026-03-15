import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import {
  Button,
  Input,
  Textarea,
  Modal,
  DataTable,
  LoadingSpinner,
  Card,
} from '../../components/ui'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { useQuery } from '../../hooks/useQuery'
import { getDonors, createDonor, updateDonor, deleteDonor } from '../../lib/queries'
import type { Donor } from '../../types/database'

type DonorFormData = {
  name: string
  email: string
  phone: string
  address_line1: string
  address_line2: string
  city: string
  state: string
  zip: string
  country: string
  notes: string
}

const emptyForm: DonorFormData = {
  name: '',
  email: '',
  phone: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  zip: '',
  country: 'US',
  notes: '',
}

export default function DonorsPage() {
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null)
  const [form, setForm] = useState<DonorFormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<Donor | null>(null)

  const { data: donors, loading, error, refetch } = useQuery(getDonors)

  const filtered = (donors ?? []).filter((d) =>
    search
      ? d.name.toLowerCase().includes(search.toLowerCase()) ||
        (d.email?.toLowerCase().includes(search.toLowerCase()) ?? false)
      : true
  )

  const columns: DataTableColumn<Donor>[] = [
    { key: 'name', label: 'Name', sortable: true },
    {
      key: 'email',
      label: 'Email',
      render: (val) => (val as string) || '—',
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (val) => (val as string) || '—',
    },
    {
      key: 'city',
      label: 'Location',
      render: (_, row) => {
        const parts = [row.city, row.state].filter(Boolean)
        return parts.join(', ') || '—'
      },
    },
  ]

  function openCreate() {
    setEditingDonor(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(donor: Donor) {
    setEditingDonor(donor)
    setForm({
      name: donor.name,
      email: donor.email ?? '',
      phone: donor.phone ?? '',
      address_line1: donor.address_line1 ?? '',
      address_line2: donor.address_line2 ?? '',
      city: donor.city ?? '',
      state: donor.state ?? '',
      zip: donor.zip ?? '',
      country: donor.country ?? 'US',
      notes: donor.notes ?? '',
    })
    setModalOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        address_line1: form.address_line1 || null,
        address_line2: form.address_line2 || null,
        city: form.city || null,
        state: form.state || null,
        zip: form.zip || null,
        country: form.country || null,
        notes: form.notes || null,
      }

      if (editingDonor) {
        await updateDonor(editingDonor.id, payload)
      } else {
        await createDonor(payload)
      }

      setModalOpen(false)
      refetch()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save donor')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteConfirm) return
    try {
      await deleteDonor(deleteConfirm.id)
      setDeleteConfirm(null)
      refetch()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete donor')
    }
  }

  function setField(key: keyof DonorFormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
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
        <h1 className="text-4xl font-display font-bold text-text-high">
          Donors
        </h1>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Donor
        </Button>
      </div>

      {error && (
        <Card>
          <p className="text-danger">{error}</p>
        </Card>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-white text-text-high placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(row) => openEdit(row)}
        emptyMessage="No donors found"
      />

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDonor ? 'Edit Donor' : 'Add Donor'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            required
            value={form.name}
            onChange={(e) => setField('name', e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
            />
            <Input
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
            />
          </div>
          <Input
            label="Address Line 1"
            value={form.address_line1}
            onChange={(e) => setField('address_line1', e.target.value)}
          />
          <Input
            label="Address Line 2"
            value={form.address_line2}
            onChange={(e) => setField('address_line2', e.target.value)}
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Input
              label="City"
              value={form.city}
              onChange={(e) => setField('city', e.target.value)}
              className="col-span-2"
            />
            <Input
              label="State"
              value={form.state}
              onChange={(e) => setField('state', e.target.value)}
            />
            <Input
              label="ZIP"
              value={form.zip}
              onChange={(e) => setField('zip', e.target.value)}
            />
          </div>
          <Textarea
            label="Notes"
            value={form.notes}
            onChange={(e) => setField('notes', e.target.value)}
            rows={3}
          />

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              {editingDonor && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setModalOpen(false)
                    setDeleteConfirm(editingDonor)
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
                {editingDonor ? 'Save Changes' : 'Add Donor'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Donor"
        size="sm"
      >
        <p className="text-text-high mb-6">
          Are you sure you want to delete{' '}
          <strong>{deleteConfirm?.name}</strong>? This will also remove all
          associated sponsorships and donations.
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

export { DonorsPage as Component }
