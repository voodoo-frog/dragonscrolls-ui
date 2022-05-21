export const sorter = (arr) => {
  return arr.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
};

export const fetcher = (...args) => fetch(...args).then((res) => res.json());
