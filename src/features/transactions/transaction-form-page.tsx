import { Link, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useMemo, useState } from 'react'
import { PageHeader } from '~/components/page-header'
import { Icon } from '~/components/ui/icon'
import { formatNumber, formatRupiah } from '~/lib/format'
import type {
  ProductOption,
  TransactionRow,
  TransactionType,
} from '~/lib/transactions'
import { saveTransactionFn } from '~/server/transactions/transactions.functions'

const copy = {
  production: {
    title: 'Produksi',
    newTitle: 'Tambah produksi',
    editTitle: 'Edit produksi',
    description: 'Catat produksi barang jadi dan biaya produksinya.',
    backTo: '/production',
    dateLabel: 'Tanggal produksi',
    priceLabel: 'Biaya produksi satuan',
    stockLabel: 'Stok saat ini',
    status: 'Menambah stok',
    submitNew: 'Simpan produksi',
    submitEdit: 'Simpan perubahan',
  },
  sales: {
    title: 'Penjualan',
    newTitle: 'Tambah penjualan',
    editTitle: 'Edit penjualan',
    description: 'Catat penjualan, validasi stok, dan hitung total otomatis.',
    backTo: '/sales',
    dateLabel: 'Tanggal penjualan',
    priceLabel: 'Harga jual satuan',
    stockLabel: 'Stok tersedia',
    status: 'Validasi stok aktif',
    submitNew: 'Simpan penjualan',
    submitEdit: 'Simpan perubahan',
  },
} satisfies Record<
  TransactionType,
  {
    title: string
    newTitle: string
    editTitle: string
    description: string
    backTo: '/production' | '/sales'
    dateLabel: string
    priceLabel: string
    stockLabel: string
    status: string
    submitNew: string
    submitEdit: string
  }
>

const defaultTransactionSearch = {
  search: '',
  from: '',
  to: '',
  product: 0,
  sort: 'date',
  direction: 'desc',
  page: 1,
  perPage: 10,
} as const

export function TransactionFormPage({
  type,
  products,
  row,
}: {
  type: TransactionType
  products: Array<ProductOption>
  row?: TransactionRow | null
}) {
  const router = useRouter()
  const saveTransaction = useServerFn(saveTransactionFn)
  const pageCopy = copy[type]
  const [productId, setProductId] = useState(
    row?.productId ?? products.at(0)?.id ?? 0,
  )
  const [quantity, setQuantity] = useState(row?.quantity ?? 1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const product = useMemo(
    () => products.find((item) => item.id === productId) ?? products.at(0),
    [productId, products],
  )
  const unitPrice =
    row && row.productId === product?.id
      ? row.unitPrice
      : type === 'production'
        ? product?.productionPrice ?? 0
        : product?.salePrice ?? 0
  const stock = product?.available ?? 0
  const effectiveStock =
    type === 'sales' && row && row.productId === product?.id
      ? stock + row.quantity
      : stock
  const stockError =
    type === 'sales' && quantity > effectiveStock
      ? `Stok ${product?.name ?? 'produk'} tersedia ${formatNumber(
          effectiveStock,
        )} ${product?.unit ?? 'unit'}.`
      : ''

  return (
    <>
      <PageHeader
        title={row ? pageCopy.editTitle : pageCopy.newTitle}
        description={pageCopy.description}
      />
      <section className="card form-card">
        <div className="card-header">
          <div>
            <h2>Detail transaksi</h2>
            <p>Harga diambil dari data produk dan divalidasi kembali saat disimpan.</p>
          </div>
        </div>
        <div className="card-body">
          <form
            onSubmit={async (event) => {
              event.preventDefault()
              setError('')

              const form = new FormData(event.currentTarget)
              if (stockError) {
                setError(stockError)
                return
              }

              setSaving(true)
              try {
                await saveTransaction({
                  data: {
                    type,
                    id: row?.id,
                    productId: Number(form.get('productId')),
                    date: String(form.get('date') ?? ''),
                    quantity: Number(form.get('quantity')),
                    unitPrice,
                    note: String(form.get('note') ?? '').trim(),
                  },
                })
                await router.navigate({
                  to: pageCopy.backTo,
                  search: defaultTransactionSearch,
                })
              } catch (error) {
                setError(
                  error instanceof Error ? error.message : 'Gagal menyimpan data.',
                )
              } finally {
                setSaving(false)
              }
            }}
          >
            <div className="form-grid">
              <div className="field">
                <label htmlFor="date">{pageCopy.dateLabel}</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={row?.date ?? todayInputValue()}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="productId">Produk</label>
                <select
                  id="productId"
                  name="productId"
                  value={productId}
                  onChange={(event) => {
                    setError('')
                    setProductId(Number(event.target.value))
                  }}
                  required
                >
                  {products.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.sku})
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="quantity">Jumlah</label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min={1}
                  step={1}
                  value={quantity}
                  onChange={(event) => {
                    setError('')
                    setQuantity(Number(event.target.value))
                  }}
                  required
                />
                {error || stockError ? (
                  <span className="field-error">{error || stockError}</span>
                ) : null}
              </div>
              <div className="field">
                <label htmlFor="displayPrice">{pageCopy.priceLabel}</label>
                <input
                  id="displayPrice"
                  type="text"
                  value={formatRupiah(unitPrice)}
                  readOnly
                />
                <span className="field-help">
                  Nilai produk saat transaksi disimpan sebagai riwayat.
                </span>
              </div>
              <div className="field field-full">
                <label htmlFor="note">
                  Catatan <span className="muted">(opsional)</span>
                </label>
                <textarea
                  id="note"
                  name="note"
                  maxLength={500}
                  placeholder="Tambahkan konteks transaksi"
                  defaultValue={row?.note ?? ''}
                />
              </div>
            </div>
            <div className="form-summary">
              <div className="summary-box">
                <span>{pageCopy.stockLabel}</span>
                <strong>
                  {formatNumber(effectiveStock)} {product?.unit ?? 'unit'}
                </strong>
              </div>
              <div className="summary-box">
                <span>Total perhitungan</span>
                <strong>{formatRupiah(quantity * unitPrice)}</strong>
              </div>
              <div className="summary-box">
                <span>Status</span>
                <strong>{stockError || pageCopy.status}</strong>
              </div>
            </div>
            <div className="form-actions">
              <Link
                className="button button-secondary"
                search={defaultTransactionSearch}
                to={pageCopy.backTo}
              >
                Batal
              </Link>
              <button
                className="button button-primary"
                type="submit"
                disabled={saving || Boolean(stockError)}
              >
                {saving
                  ? 'Menyimpan...'
                  : row
                    ? pageCopy.submitEdit
                    : pageCopy.submitNew}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

function todayInputValue() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
