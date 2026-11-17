export const company = {
  name: "(주)동성건설",
  legalName: "주식회사 동성건설",
  nameEn: "DONGSEONG CONSTRUCTION CO., LTD.",
  ceo: null as string | null,
  businessNumber: null as string | null,
  licenseInfo: null as string | null,
  phone: null as string | null,
  fax: null as string | null,
  email: null as string | null,
  address: null as string | null,
  hours: "평일 09:00 – 18:00 (토·일·공휴일 휴무 / 세부 운영시간 업체 확정 후 고시)",
  privacyOfficer: null as string | null,
  privacyDepartment: "경영관리부 (담당자 정보 확인 후 고시)",
  policyEffectiveDate: "2026년 11월 17일",
  copyright: `© ${new Date().getFullYear()} DONGSEONG CONSTRUCTION CO., LTD. ALL RIGHTS RESERVED.`,
} as const;

export const hasPublishedContact = Boolean(company.phone || company.email || company.address);
