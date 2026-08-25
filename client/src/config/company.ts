export const company = {
  name: "동성건설(주)",
  nameEn: "DONGSEONG CONSTRUCTION CO., LTD.",
  phone: null as string | null,
  email: null as string | null,
  address: null as string | null,
  hours: null as string | null,
  copyright: `© ${new Date().getFullYear()} DONGSEONG CONSTRUCTION CO., LTD.`,
} as const;

export const hasPublishedContact = Boolean(company.phone || company.email || company.address);
