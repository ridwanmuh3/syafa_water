const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('id-ID')

export function formatRupiah(value: number) {
  return rupiahFormatter.format(value)
}

export function formatNumber(value: number) {
  return numberFormatter.format(value)
}
