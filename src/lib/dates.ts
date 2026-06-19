const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00+07:00`))
}

export function currentMonthRange(today = new Date()) {
  const year = today.getFullYear()
  const month = today.getMonth()
  const start = new Date(year, month, 1)
  const end = new Date(year, month + 1, 0)

  return {
    from: toDateInputValue(start),
    to: toDateInputValue(end),
  }
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
