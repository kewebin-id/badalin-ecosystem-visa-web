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
