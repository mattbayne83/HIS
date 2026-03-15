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
  Select,
} from '../../components/ui'
import type { DataTableColumn } from '../../components/ui/DataTable'
import { useQuery } from '../../hooks/useQuery'
import {
  getDonations,
  getDonors,
  createDonation,
  updateDonation,
  deleteDonation,
} from '../../lib/queries'
import type { Donation } from '../../types/database'

type DonationFormData = {
  donor_id: string
  amount: string // dollars as string (for input)
  donation_date: string
  purpose: string
  payment_method: string
  notes: string
}

const emptyForm: DonationFormData = {
  donor_id: '',
  amount: '',
  donation_date: new Date().toISOString().split('T')[0],
  purpose: '',
  payment_method: '',
  notes: '',
}

// Currency formatter
const formatCurrency = (amountCents: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amountCents / 100)
}

export default function DonationsPage() {
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null)
  const [form, setForm] = useState<DonationFormData>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<Donation | null>(null)

  const { data: donations, loading, error, refetch } = useQuery(getDonations)
  const { data: donors } = useQuery(getDonors)

  const filtered = (donations ?? []).filter((d) =>
    search
      ? d.donor?.name.toLowerCase().includes(search.toLowerCase()) ||
        d.purpose?.toLowerCase().includes(search.toLowerCase())
      : true
  )

  const columns: DataTableColumn<Donation>[] = [
    {
      key: 'donation_date',
      label: 'Date',
      sortable: true,
      render: (val) => new Date(val as string).toLocaleDateString(),
    },
    {
      key: 'donor',
      label: 'Donor',
      render: (_, row) => row.donor?.name || '—',
    },
    {
      key: 'amount_cents',
      label: 'Amount',
      sortable: true,
      render: (val) => formatCurrency(val as number),
    },
    {
      key: 'purpose',
      label: 'Purpose',
      render: (val) => (val as string) || '—',
    },
  ]

  function openCreate() {
    setEditingDonation(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(donation: Donation) {
    setEditingDonation(donation)
    setForm({
      donor_id: donation.donor_id,
      amount: (donation.amount_cents / 100).toFixed(2),
      donation_date: donation.donation_date,
      purpose: donation.purpose ?? '',
      payment_method: donation.payment_method ?? '',
      notes: donation.notes ?? '',
    })
    setModalOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const amountCents = Math.round(parseFloat(form.amount) * 100)

      if (isNaN(amountCents) || amountCents <= 0) {
        alert('Please enter a valid amount')
        setSaving(false)
        return
      }

      const payload = {
        donor_id: form.donor_id,
        amount_cents: amountCents,
        currency: 'USD',
        donation_date: form.donation_date,
        purpose: form.purpose || null,
        payment_method: form.payment_method || null,
        stripe_payment_id: null,
        notes: form.notes || null,
      }

      if (editingDonation) {
        await updateDonation(editingDonation.id, payload)
      } else {
        await createDonation(payload)
      }

      setModalOpen(false)
      refetch()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save donation')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteConfirm) return
    try {
      await deleteDonation(deleteConfirm.id)
      setDeleteConfirm(null)
      refetch()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete donation')
    }
  }

  function setField(key: keyof DonationFormData, value: string) {
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
          Donations
        </h1>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Record Donation
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
          placeholder="Search by donor or purpose..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-white text-text-high placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(row) => openEdit(row)}
        emptyMessage="No donations found"
      />

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingDonation ? 'Edit Donation' : 'Record Donation'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Donor"
            required
            value={form.donor_id}
            onChange={(e) => setField('donor_id', e.target.value)}
            options={[
              { value: '', label: 'Select a donor...' },
              ...(donors ?? []).map((d) => ({
                value: d.id,
                label: d.name,
              })),
            ]}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Amount (USD)"
              type="number"
              step="0.01"
              min="0.01"
              required
              value={form.amount}
              onChange={(e) => setField('amount', e.target.value)}
              placeholder="0.00"
            />
            <Input
              label="Date"
              type="date"
              required
              value={form.donation_date}
              onChange={(e) => setField('donation_date', e.target.value)}
            />
          </div>

          <Input
            label="Purpose"
            value={form.purpose}
            onChange={(e) => setField('purpose', e.target.value)}
            placeholder="e.g., Student sponsorship, general fund"
          />

          <Input
            label="Payment Method"
            value={form.payment_method}
            onChange={(e) => setField('payment_method', e.target.value)}
            placeholder="e.g., Check, Cash, Credit Card"
          />

          <Textarea
            label="Notes"
            value={form.notes}
            onChange={(e) => setField('notes', e.target.value)}
            rows={3}
          />

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              {editingDonation && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setModalOpen(false)
                    setDeleteConfirm(editingDonation)
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
                {editingDonation ? 'Save Changes' : 'Record Donation'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Donation"
        size="sm"
      >
        <p className="text-text-high mb-6">
          Are you sure you want to delete this donation of{' '}
          <strong>{deleteConfirm && formatCurrency(deleteConfirm.amount_cents)}</strong>{' '}
          from <strong>{deleteConfirm?.donor?.name}</strong>?
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

export { DonationsPage as Component }
