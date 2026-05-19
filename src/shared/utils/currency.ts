export const formatRupiah = (currency: number, char?: ',' | '.', withoutRp?: boolean) => {
  if (!currency) return (withoutRp ?? false) ? '0' : 'Rp 0';
  let rupiah = '';
  if (typeof currency === 'string') {
    return currency;
  }
  const currencyFloat = currency.toFixed(0);
  const angkarev = currencyFloat.toString().split('').reverse().join('');
  for (let i = 0; i < angkarev.length; i++) {
    if (i % 3 === 0) {
      rupiah += angkarev.substr(i, 3) + (char || '.');
    }
  }
  return (
    ((withoutRp ?? false) ? '' : 'Rp ') +
    rupiah
      .split('', rupiah.length - 1)
      .reverse()
      .join('')
  );
};

export const unformatRupiah = (price: string) => {
  try {
    return price.replace(/\D/g, '');
    // eslint-disable-next-line
  } catch (_) {
    return '0';
  }
};

export const formatCurrency = (amount: number, currency?: string): string => {
  const code = currency?.toUpperCase() || 'IDR';
  if (code === 'USD') {
    if (!amount) return '$ 0';
    const parts = amount.toFixed(0).toString().split('').reverse().join('');
    let usd = '';
    for (let i = 0; i < parts.length; i++) {
      if (i % 3 === 0) {
        usd += parts.substr(i, 3) + ',';
      }
    }
    return '$ ' + usd.split('', usd.length - 1).reverse().join('');
  } else if (code === 'SAR') {
    if (!amount) return 'SR 0';
    const parts = amount.toFixed(0).toString().split('').reverse().join('');
    let sar = '';
    for (let i = 0; i < parts.length; i++) {
      if (i % 3 === 0) {
        sar += parts.substr(i, 3) + '.';
      }
    }
    return 'SR ' + sar.split('', sar.length - 1).reverse().join('');
  } else {
    return formatRupiah(amount);
  }
};
