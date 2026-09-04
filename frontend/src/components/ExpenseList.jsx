import { useState } from 'react';
import api from '../api/axios';

const meta = {
  Food: { icon: '🍔', label: 'أكل' },
  Transport: { icon: '🚗', label: 'مواصلات' },
  Bills: { icon: '📄', label: 'فواتير' },
  Shopping: { icon: '🛍️', label: 'تسوق' },
  Health: { icon: '💊', label: 'صحة' },
  Entertainment: { icon: '🎬', label: 'ترفيه' },
  Other: { icon: '📦', label: 'أخرى' },
};

export default function ExpenseList({ expenses, onDeleted }) {
  const [deletingId, setDeletingId] = useState(null);
  const [visible, setVisible] = useState(8);

  const handleDelete = async (id) => {
    if (!window.confirm('متأكد إنك عايز تحذف المصروف ده؟')) return;
    setDeletingId(id);
    try { await api.delete('/expenses/' + id); onDeleted(id); }
    catch { window.alert('فشل حذف المصروف. حاول مرة ثانية.'); }
    finally { setDeletingId(null); }
  };

  if (!expenses.length) return (
    <div className="empty-state">
      <div className="empty-icon">＋</div>
      <h3>ابدأ تسجيل مصاريفك</h3>
      <p>أول مصروف تضيفه هيظهر هنا، وبعدها هتقدر تتابع نمط إنفاقك بسهولة.</p>
    </div>
  );

  return (
    <section className="expenses-card">
      <div className="card-heading">
        <div><h3>آخر المصاريف</h3><span>مرتبة من الأحدث للأقدم</span></div>
        <span className="records-label">{expenses.length} سجل</span>
      </div>
      <div className="expense-list">
        {expenses.slice(0, visible).map((exp) => {
          const item = meta[exp.category] || meta.Other;
          return <article className="expense-row" key={exp._id}>
            <div className="category-icon">{item.icon}</div>
            <div className="expense-info">
              <strong>{exp.note?.trim() || item.label}</strong>
              <span>{item.label} · {new Date(exp.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <strong className="expense-amount">{Number(exp.amount).toLocaleString('ar-EG')} <small>ج.م</small></strong>
            <button className="delete-btn" type="button" onClick={() => handleDelete(exp._id)} disabled={deletingId === exp._id} aria-label="حذف المصروف">{deletingId === exp._id ? '…' : '×'}</button>
          </article>;
        })}
      </div>
      {visible < expenses.length && <button className="load-more" type="button" onClick={() => setVisible((v) => v + 8)}>عرض المزيد <span>↓</span></button>}
    </section>
  );
}
