export type DataTableConfig = typeof dataTableConfig

export const dataTableConfig = {
  textOperators: [
    { label: "Is", value: "eq" as const },
    { label: "Is not", value: "ne" as const },
  ],
  numericOperators: [
    { label: "Is", value: "eq" as const },
    { label: "Is not", value: "ne" as const },
    { label: "Is less than", value: "lt" as const },
    { label: "Is less than or equal to", value: "lte" as const },
    { label: "Is greater than", value: "gt" as const },
    { label: "Is greater than or equal to", value: "gte" as const },
  ],
  dateOperators: [
    { label: "Is", value: "eq" as const },
    { label: "Is not", value: "ne" as const },
    { label: "Is before", value: "lt" as const },
    { label: "Is after", value: "gt" as const },
    { label: "Is on or before", value: "lte" as const },
    { label: "Is on or after", value: "gte" as const },
  ],
  selectOperators: [
    { label: "Is", value: "eq" as const },
    { label: "Is not", value: "ne" as const },
  ],
  booleanOperators: [
    { label: "Is", value: "eq" as const },
    { label: "Is not", value: "ne" as const },
  ],
  joinOperators: [{ label: "And", value: "and" as const }],
  sortOrders: [
    { label: "Asc", value: "asc" as const },
    { label: "Desc", value: "desc" as const },
  ],
  columnTypes: [
    "text",
    "number",
    "date",
    "boolean",
    "select",
    "multi-select",
  ] as const,
  globalOperators: [
    "eq",
    "ne",
    "lt",
    "lte",
    "gt",
    "gte",
    "and",
  ] as const,
}
