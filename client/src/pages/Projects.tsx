import { PageHero, Reveal, SiteFrame } from "@/components/SiteShell";
import { categoryLabel, projectArchive, type ProjectCategory } from "@/data/projects";
import { usePageMeta } from "@/hooks/usePageMeta";
import { assetPath } from "@/lib/assets";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const filters: Array<{ key: "all" | ProjectCategory; label: string }> = [
  { key: "all", label: "전체 역량 (06)" },
  { key: "civil", label: "토목사업 (02)" },
  { key: "architecture", label: "건축사업 (02)" },
  { key: "field", label: "외부인프라 (02)" },
];

export default function Projects() {
  usePageMeta("프로젝트 및 수행역량", "공종별 핵심 기술 기준과 수행 체계를 소개하는 (주)동성건설 프로젝트 아카이브");
  const [selectedCategory, setSelectedCategory] = useState<"all" | ProjectCategory>("all");

  const visibleProjects =
    selectedCategory === "all"
      ? projectArchive
      : projectArchive.filter((project) => project.category === selectedCategory);

  return (
    <SiteFrame>
      <PageHero
        index="03"
        eyebrow="PROJECT & CAPABILITY"
        title="프로젝트"
        description="공종별 엔지니어링 수행 범위와 검증된 실적 공개 원칙을 안내합니다."
        image="/field-04.jpg"
      />
      <section className="s2-project-index">
        <Reveal className="s2-project-index__intro">
          <p>CAPABILITY &amp; ARCHIVE POLICY</p>
          <h2>
            공종별 핵심 수행 역량과
            <br />
            투명한 아카이브 기준.
          </h2>
          <span>
            아래 아카이브는 (주)동성건설이 수행하는 주요 공종별 기술 범위와 품질 관리 포인트를 안내합니다. 개별 현장의 발주처명·준공연도·사진은 발주처 공개 승인이 완료된 건에 한해 정확히 등재합니다.
          </span>
        </Reveal>

        <div className="s2-project-filters" role="tablist" aria-label="사업부문별 필터">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              role="tab"
              aria-selected={selectedCategory === filter.key}
              className={selectedCategory === filter.key ? "is-active" : ""}
              onClick={() => setSelectedCategory(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="s2-project-index__grid">
          {visibleProjects.map((project, index) => (
            <article key={project.id}>
              <figure>
                <img src={assetPath(project.thumbnail)} alt={`${project.title} 수행역량 이미지`} loading="lazy" decoding="async" />
                <span>{project.code}</span>
              </figure>
              <div>
                <small>
                  0{index + 1} / {categoryLabel[project.category]}
                </small>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <dl>
                  <div>
                    <dt>TARGET</dt>
                    <dd>{project.targetFacility}</dd>
                  </div>
                  <div>
                    <dt>KEY SCOPE</dt>
                    <dd>{project.keyScope}</dd>
                  </div>
                  <div>
                    <dt>QC FOCUS</dt>
                    <dd>{project.qualityFocus}</dd>
                  </div>
                  <div>
                    <dt>CHECKLIST</dt>
                    <dd>{project.highlights.join(" · ")}</dd>
                  </div>
                </dl>
                <Link className="s2-project-card-cta" href="/contact">
                  유사 공종 검토 문의 <ArrowUpRight size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteFrame>
  );
}
