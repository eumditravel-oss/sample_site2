export type ProjectCategory = "civil" | "architecture" | "field";

export type Project = {
  id: string;
  title: string;
  code: string;
  category: ProjectCategory;
  targetFacility: string;
  keyScope: string;
  qualityFocus: string;
  summary: string;
  thumbnail: string;
  highlights: string[];
  placeholder: true;
};

export const projectArchive: Project[] = [
  {
    id: "civil-highway-infra",
    code: "DS-CIV-01",
    title: "광역 도로 및 교량 기반시설 엔지니어링",
    category: "civil",
    targetFacility: "도시 간선도로 · 접속교량 · 입체교차 기반구간",
    keyScope: "노반 성토·다짐, 교각 하부기초, 아스팔트·콘크리트 포장, 배수 구조물",
    qualityFocus: "지반 지지력 확보, 선형·종단 구배 정밀도, 교량 접속부 침하 제어",
    summary: "도시 물류와 교통 흐름을 지탱하는 광역 도로망 및 구조물 공정을 지반 조건과 구조 안전성 기준으로 수행합니다.",
    thumbnail: "/field-01.jpg",
    highlights: ["토공·기초 지반 지지력 시험", "구조물 철근·콘크리트 정밀 검측", "주행 안전성 및 노면 배수 체계 관리"],
    placeholder: true,
  },
  {
    id: "arch-corporate-complex",
    code: "DS-ARC-01",
    title: "업무·연구 복합시설 신축 및 외피 시공",
    category: "architecture",
    targetFacility: "기업 사옥 · R&D 센터 · 업무·근린 복합건축물",
    keyScope: "철근콘크리트·철골 골조, 석재·커튼월 외장, 설비·전기 공정 인터페이스",
    qualityFocus: "구조체 수직·수평 정밀도, 외피 단열·방수 기밀성, 내부 공간 마감 완성도",
    summary: "건축물의 구조적 내구성과 사용자 동선, 에너지 효율을 통합 검토하여 완성도 높은 업무·상업 공간을 구현합니다.",
    thumbnail: "/field-02.jpg",
    highlights: ["골조·외장 간섭 사전 BIM/도서 검토", "창호·외벽 누수 및 단열 집중 관리", "공용부·진입 광장 일체형 마감"],
    placeholder: true,
  },
  {
    id: "civil-site-development",
    code: "DS-CIV-02",
    title: "산업·택지 부지조성 및 사면·우수 기반공사",
    category: "civil",
    targetFacility: "일반산업단지 · 물류단지 · 공동주택·업무 택지",
    keyScope: "대규모 절·성토 토공, 보강토·RC 옹벽, 우수·오수 관로 및 저류 기반",
    qualityFocus: "함수비·다짐도 단계 검측, 사면 안정성 관리, 집중호우 대비 배수 용량 확보",
    summary: "건축 착공의 성패를 좌우하는 부지 레벨 계획과 지하 매설 관망, 법면·옹벽 구조물을 체계적으로 구축합니다.",
    thumbnail: "/field-05.jpg",
    highlights: ["원지반 조사 및 연약지반 치환·보강", "우수 맨홀·관로 수밀성 및 구배 검측", "단계식 옹벽 배면 배수층 철저 시공"],
    placeholder: true,
  },
  {
    id: "arch-smart-industrial",
    code: "DS-ARC-02",
    title: "스마트 물류·첨단 제조시설 건설",
    category: "architecture",
    targetFacility: "저온·상온 물류센터 · 첨단 제조공장 · 플랜트 부속동",
    keyScope: "장스팬 철골·PC 구조, 초평탄 바닥 콘크리트, 대형 도크 및 하역장 포장",
    qualityFocus: "바닥 균열·평탄도 관리, 방화구획·소방 안전 기준, 대형 화물차 회전 반경 확보",
    summary: "물류 설비 하중과 산업 현장 운영 효율을 반영해 장스팬 구조 시공부터 야드 포장까지 원스톱으로 수행합니다.",
    thumbnail: "/field-04.jpg",
    highlights: ["장스팬 철골 볼트 접합·수직도 관리", "고강도 하드너·초평탄 바닥 타설", "대형 차량 진출입 도크 내구성 확보"],
    placeholder: true,
  },
  {
    id: "field-structural-qc",
    code: "DS-FLD-01",
    title: "현장 구조 검측 및 기존 시설물 리모델링·보강",
    category: "field",
    targetFacility: "노후 업무·산업 건축물 · 단지 부대구조물 · 공공기반시설",
    keyScope: "구조체 건전성 점검, 단면 복구·방수 보수, 내외부 기능 개선 및 대수선",
    qualityFocus: "운영 중 시설 안전 동선 분리, 설계도서·실측 대조, 보강 자재 정품 시방 준수",
    summary: "사용 중인 건축물과 외부 구조물의 노후·손상 원인을 정밀 진단하고 안전 기준에 부합하는 성능 개선 시공을 제공합니다.",
    thumbnail: "/field-03.jpg",
    highlights: ["설계도서·현장 조건 정합성 사전 검토", "공정별 입회 검측 및 사진 대장 기록", "주변 통행 안전 및 비산·소음 저감 관리"],
    placeholder: true,
  },
  {
    id: "field-exterior-infra",
    code: "DS-FLD-02",
    title: "단지 외부환경·진입광장 및 부대토목 통합 마감",
    category: "field",
    targetFacility: "사옥·캠퍼스 외부광장 · 아파트·산업단지 외구 · 보차도 연결구간",
    keyScope: "화강석·투수블록 포장, 경계·조경 시설물, 야간 조명·배수 트렌치 통합 마감",
    qualityFocus: "건축물 1층 레벨과 외부 배수 구배 일치, 무장애(BF) 보행 단차 해소, 동절기 동해 방지",
    summary: "토목 기반과 건축 공간을 하나로 잇는 외부 진입부·광장·보행 환경을 정교한 마감 디테일로 완성합니다.",
    thumbnail: "/field-02.jpg",
    highlights: ["건축 마감선·외부 구배 정밀 연결", "석재·블록 백화 및 침하 방지 기층 시공", "보행약자 배려 경사로·점자블록 기준 준수"],
    placeholder: true,
  },
];

export const categoryLabel: Record<ProjectCategory, string> = {
  civil: "토목사업",
  architecture: "건축사업",
  field: "외부인프라",
};
