import { useEffect, useRef, useState } from 'react';
import { Users } from 'lucide-react';
import { useAccountResource } from '../mobile/account/useAccountResource';
import './teamDirectory.css';

export const teamDepartments = [
  ['dieuhanh', 'Ban điều hành'], ['truyenthong', 'Ban truyền thông'],
  ['haucan', 'Ban hậu cần'], ['codong', 'Ban cơ động'],
] as const;
export type Department = typeof teamDepartments[number][0];
export type TeamMember = { id: string; name: string; department: Department; role: string; image: string; order: number; active?: boolean };

function MemberPhoto({ member }: { member: TeamMember }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [member.image]);
  return <div className="member-photo">
    {member.image && !failed ? <img src={member.image} alt={member.name} loading="lazy" decoding="async" width={400} height={400} onError={() => setFailed(true)} />
      : <div className="team-photo-fallback"><Users size={36} aria-hidden="true" /><span>Chưa có ảnh</span></div>}
  </div>;
}

export function TeamDirectory({ teamTab, setTeamTab }: { teamTab: Department; setTeamTab: (tab: Department) => void }) {
  const resource = useAccountResource<TeamMember[]>('/public/saigonxanh/team-members');
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const members = (resource.data || []).filter((member) => member.department === teamTab);
  return <section className="about-team team-directory" aria-labelledby="team-heading">
    <h2 id="team-heading">SÀI GÒN XANH LÀ NHỮNG AI?</h2>
    <p className="team-sub">Những thành viên cùng chung tay vì môi trường xanh, sạch.</p>
    <div className="team-tabs-bar" role="tablist" aria-label="Các ban Sài Gòn Xanh">
      {teamDepartments.map(([key, label], index) => <button key={key} id={`team-tab-${key}`} ref={(el) => { tabs.current[index] = el; }}
        type="button" role="tab" aria-selected={teamTab === key} aria-controls="team-panel" tabIndex={teamTab === key ? 0 : -1}
        className={teamTab === key ? 'active' : ''} onClick={() => setTeamTab(key)} onKeyDown={(event) => {
          const next = event.key === 'ArrowRight' ? (index + 1) % 4 : event.key === 'ArrowLeft' ? (index + 3) % 4 : event.key === 'Home' ? 0 : event.key === 'End' ? 3 : -1;
          if (next >= 0) { event.preventDefault(); setTeamTab(teamDepartments[next][0]); tabs.current[next]?.focus(); }
        }}>{label}</button>)}
    </div>
    <div id="team-panel" role="tabpanel" aria-labelledby={`team-tab-${teamTab}`} aria-busy={resource.loading} tabIndex={0}>
      {resource.loading ? <p role="status">Đang tải thành viên…</p> : resource.error ? <p role="alert">Không tải được danh sách. <button onClick={resource.reload}>Thử lại</button></p>
        : members.length === 0 ? <p>Chưa có thành viên được cập nhật cho ban này.</p>
          : <div className="team-members-grid">{members.map((member) => <article className="member-card" key={member.id}>
            <MemberPhoto member={member} /><h4>{member.name}</h4>{member.role && <small>{member.role}</small>}
          </article>)}</div>}
    </div>
  </section>;
}
