export const toNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0

  const parsed = typeof value === 'number'
    ? value
    : Number(String(value).replace(/[^0-9.-]+/g, ''))

  return Number.isFinite(parsed) ? parsed : 0
}

export const sanitizeMoney = (value) => {
  const amount = toNumber(value)
  return Number(Math.max(0, amount).toFixed(2))
}

export const sanitizeMomoAmount = (value) => {
  const amount = sanitizeMoney(value)
  const stringValue = amount.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')
  return Number(stringValue)
}

export const buildAirtelEcashUssd = (value, merchantNumber = '0728094581') => {
  const amount = sanitizeMomoAmount(value)
  return `*182*1*2*${merchantNumber}*${amount}#`
}

export const formatMoney = (value, currency = 'RWF', locale = 'en-US') => {
  const safeValue = sanitizeMoney(value)

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeValue)
}

export const formatMoneyCompact = (value, currency = 'RWF', locale = 'en-US') => {
  const safeValue = sanitizeMoney(value)

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(safeValue)
}
