export type ProjectCategory = "civil" | "architecture" | "field";

export type Project = {
  id: string;
  title: string;
  category: ProjectCategory;
  location?: string;
  year?: string;
  client?: string;
  summary?: string;
  thumbnail: string;
  gallery?: string[];
  placeholder: true;
};

export const projectArchive: Project[] = [
  {
    id: "civil-archive",
    title: "CIVIL INFRASTRUCTURE",
    category: "civil",
    summary: "실제 프로젝트 정보 등록을 위한 토목 아카이브입니다.",
    thumbnail: "/field-01.jpg",
    placeholder: true,
  },
  {
    id: "architecture-archive",
    title: "ARCHITECTURAL WORKS",
    category: "architecture",
    summary: "실제 프로젝트 정보 등록을 위한 건축 아카이브입니다.",
    thumbnail: "/field-02.jpg",
    placeholder: true,
  },
  {
    id: "field-archive",
    title: "FIELD ENGINEERING",
    category: "field",
    summary: "실제 프로젝트 정보 등록을 위한 외부시설 아카이브입니다.",
    thumbnail: "/field-03.jpg",
    placeholder: true,
  },
];

export const categoryLabel: Record<ProjectCategory, string> = {
  civil: "토목",
  architecture: "건축",
  field: "외부시설",
};
