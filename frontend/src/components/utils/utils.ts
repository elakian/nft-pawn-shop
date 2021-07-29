export const formatAddress = (address: string) => {
  return (
    address.substring(0, 6) +
    "..." +
    address.substring(address.length - 4, address.length)
  );
};

export const statusText = (index: number) => {
  const mapping = ["Waiting", "Active", "Returned", "Defaulted", "Cancelled"];
  return mapping[index];
};
