import type { KolItem } from '../types';
import './kolPartners.css';

export function KolPartnersSection({ kols }: { kols: KolItem[] }) {
  const partners = kols.filter((kol) => kol.active !== false);
  return (
    <section className="sgx-page-cooperate kol-partners-page" aria-labelledby="kol-partners-title">
      <header className="kol-partners-heading">
        <h1 id="kol-partners-title">Hợp tác với KOL & nghệ sĩ</h1>
        <p>
          Những gương mặt đồng hành cùng Sài Gòn Xanh, lan tỏa lối sống xanh và trực tiếp tham gia
          các hoạt động vì môi trường.
        </p>
      </header>
      {partners.length === 0 ? (
        <p className="kol-partners-empty">Chưa có nghệ sĩ / KOL đồng hành được cập nhật.</p>
      ) : (
        <div className="cooperate-showcase-grid">
          {partners.map((kol) => (
            <article key={kol.id} className="coop-item">
              <div className="coop-item-img-wrap">
                <img
                  src={kol.image}
                  alt={kol.name}
                  loading="lazy"
                  decoding="async"
                  onError={(event) => {
                    const image = event.currentTarget;
                    if (!image.src.endsWith('/images/trangChu/logo.png'))
                      image.src = '/images/trangChu/logo.png';
                  }}
                />
              </div>
              <div className="coop-item-body">
                <h2>{kol.name}</h2>
                <span className="coop-item-role">{kol.role}</span>
                {kol.desc && <p>{kol.desc}</p>}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
