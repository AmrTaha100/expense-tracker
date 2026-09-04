const meta = {
  Food: { icon: '🍔', label: 'أكل' }, Transport: { icon: '🚗', label: 'مواصلات' },
  Bills: { icon: '📄', label: 'فواتير' }, Shopping: { icon: '🛍️', label: 'تسوق' },
  Health: { icon: '💊', label: 'صحة' }, Entertainment: { icon: '🎬', label: 'ترفيه' }, Other: { icon: '📦', label: 'أخرى' },
};
const colors = ['#167a50', '#4f7cff', '#8b5cf6', '#14b8a6', '#ec4899', '#f59e0b', '#64748b'];

export default function ExpenseChart({ stats }) {
  if (!stats?.length) return <section className="insights-card"><div className="card-heading"><div><h3>تحليل الإنفاق</h3><span>نظرة على توزيع مصاريفك</span></div></div><div className="chart-empty"><strong>مفيش بيانات كفاية لسه</strong><br />أضف أول مصروف عشان يظهر التحليل هنا.</div></section>;
  const total = stats.reduce((sum, s) => sum + Number(s.total || 0), 0);
  const sorted = [...stats].sort((a, b) => Number(b.total) - Number(a.total));
  return <section className="insights-card">
    <div className="card-heading"><div><h3>تحليل الإنفاق</h3><span>توزيع المصاريف حسب الفئة</span></div><span className="mini-total">{total.toLocaleString('ar-EG')} ج.م</span></div>
    <div className="insight-total"><span>أكبر فئة إنفاق</span><strong>{meta[sorted[0]._id]?.label || sorted[0]._id}</strong><b>{Math.round(Number(sorted[0].total) / total * 100)}%</b></div>
    <div className="category-list">{sorted.map((s, index) => {
      const amount = Number(s.total); const percent = Math.round(amount / total * 100);
      const item = meta[s._id] || meta.Other;
      return <div className="category-item" key={s._id}>
        <div className="category-top"><span><i className="category-icon small">{item.icon}</i>{item.label}</span><strong>{percent}%</strong></div>
        <div className="progress-track"><div className="progress-fill" style={{ width: Math.max(percent, 4) + '%', '--bar-color': colors[index % colors.length] }} /></div>
        <span className="category-amount">{amount.toLocaleString('ar-EG')} ج.م</span>
      </div>;
    })}</div>
  </section>;
}
