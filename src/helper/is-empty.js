export const isEmpty = (data) => {
  return (
    data === null || data === undefined || data === "" || data.length === 0
  );
};
