const formatProductName = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default formatProductName;
