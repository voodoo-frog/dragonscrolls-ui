export const sorter = (arr) => {
  return arr.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
};

export const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const capitalize = (val) => {
  if (val instanceof String) {
    return val.charAt(0).toUpperCase() + val.substring(1);
  } else {
    return val;
  }
};

export const currencyConverter = (qty, from, to) => {
  const rates = {
    cp: 20,
    sp: 2,
    ep: 1,
    gp: 0.2,
    pp: 0.02,
  };
  const fromRate = rates[from];
  const toRate = rates[to];
  return Math.round(qty * (toRate / fromRate) * 100) / 100;
};

export const goldConverter = (qty, from) => {
  return currencyConverter(qty, from, 'gp');
};
