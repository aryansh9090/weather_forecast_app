export const formatDate = (dateString) => {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
