import { PageHero, Reveal, SiteFrame } from "@/components/SiteShell";
import { categoryLabel, projectArchive } from "@/data/projects";
import { usePageMeta } from "@/hooks/usePageMeta";
import { assetPath } from "@/lib/assets";

export default function Projects() {
  usePageMeta("프로젝트", "실제 프로젝트 정보 등록을 준비 중인 동성건설 프로젝트 아카이브");
  return (
    <SiteFrame>
      <PageHero index="03" eyebrow="PROJECT" title="프로젝트" description="확인된 정보만을 공개하는 프로젝트 아카이브입니다." image="/field-03.jpg" />
      <section className="s2-project-index">
        <Reveal className="s2-project-index__intro"><p>PROJECT INDEX</p><h2>실제 프로젝트 정보는<br />검증 후 공개합니다.</h2><span>현재 이미지는 아카이브 구조를 보여주기 위한 제공 이미지이며, 수행실적·발주처·위치·연도를 의미하지 않습니다.</span></Reveal>
        <div className="s2-project-index__grid">
          {projectArchive.map((project, index) => <article key={project.id}><figure><img src={assetPath(project.thumbnail)} alt="" /><span>INFORMATION PENDING</span></figure><div><small>0{index + 1} / {categoryLabel[project.category]}</small><h3>{project.title}</h3><p>{project.summary}</p><dl><div><dt>LOCATION</dt><dd>미등록</dd></div><div><dt>YEAR</dt><dd>미등록</dd></div><div><dt>CLIENT</dt><dd>미등록</dd></div></dl></div></article>)}
        </div>
      </section>
    </SiteFrame>
  );
}
