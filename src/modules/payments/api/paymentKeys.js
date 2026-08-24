export const paymentKeys = {
  all: ["payments"],
  lists: () => [...paymentKeys.all, "list"],
  list: (params) => [...paymentKeys.lists(), params],
  details: () => [...paymentKeys.all, "detail"],
  detail: (slug) => [...paymentKeys.details(), slug],
};