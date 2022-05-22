export const sorter = (arr) => {
  return arr.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
};

export const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const capitalize = (val) => {
  if (typeof val !== 'string') val = '';
  return val.charAt(0).toUpperCase() + val.substring(1);
};
