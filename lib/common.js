export const sorter = (arr) => {
  return arr.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
};
