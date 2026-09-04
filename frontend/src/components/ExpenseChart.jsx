const COLORS = ['#1f8a4c', '#ff5a1f', '#ffce3a', '#2b6cb0', '#c026d3', '#7c3aed', '#e0362b'];

export default function ExpenseChart({ stats }) {
  if (!stats || stats.length === 0) {
    return null;
  }

  const maxTotal = Math.max(...stats.map((s) => s.total));

  return (
    <div className="chart-container">
      <h3>المصاريف حسب الفئة</h3>
      {stats.map((s, index) => (
        <div className="category-bar-row" key={s._id}>
          <span className="cat-name">{s._id}</span>
          <div className="category-bar-track">
            <div
              className="category-bar-fill"
              style={{
                width: `${(s.total / maxTotal) * 100}%`,
                background: COLORS[index % COLORS.length],
              }}
            />
          </div>
          <span className="cat-amount">{s.total.toFixed(0)} ج.م</span>
        </div>
      ))}
    </div>
  );
}
