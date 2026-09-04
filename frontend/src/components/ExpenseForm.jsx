import { useState } from 'react';
import api from '../api/axios';

const CATEGORIES = [
  { value: 'Food', label: '🍔 أكل' }, { value: 'Transport', label: '🚗 مواصلات' },
  { value: 'Bills', label: '📄 فواتير' }, { value: 'Shopping', label: '🛍️ تسوق' },
  { value: 'Health', label: '💊 صحة' }, { value: 'Entertainment', label: '🎬 ترفيه' },
  { value: 'Other', label: '📦 أخرى' },
];

export default function ExpenseForm({ onAdded }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) { setError('اكتب مبلغ أكبر من صفر.'); return; }
    setError(''); setLoading(true);
    try {
      const { data } = await api.post('/expenses', { amount: numericAmount, category, note: note.trim() });
      onAdded(data); setAmount(''); setNote('');
    } catch (err) {
      setError(err.response?.data?.message || 'فشل إضافة المصروف. حاول مرة ثانية.');
    } finally { setLoading(false); }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="form-field amount-field"><label htmlFor="expense-amount">المبلغ</label><div className="input-with-suffix"><input id="expense-amount" type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} min="0.01" step="0.01" required /><span>ج.م</span></div></div>
      <div className="form-field"><label htmlFor="expense-category">الفئة</label><select id="expense-category" value={category} onChange={(e) => setCategory(e.target.value)}>{CATEGORIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
      <div className="form-field note-field"><label htmlFor="expense-note">ملاحظة</label><input id="expense-note" type="text" placeholder="مثال: غداء مع الأصدقاء" value={note} onChange={(e) => setNote(e.target.value)} maxLength={120} /></div>
      <button className="add-expense-btn" type="submit" disabled={loading}><span>{loading ? '...' : '+'}</span>{loading ? 'جاري الإضافة' : 'إضافة المصروف'}</button>
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
  );
}
