export const invoiceKeys = {
  all: ["invoices"],
  lists: () => [...invoiceKeys.all, "list"],
  list: (params) => [...invoiceKeys.lists(), params],
  details: () => [...invoiceKeys.all, "detail"],
  detail: (slug) => [...invoiceKeys.details(), slug],
};