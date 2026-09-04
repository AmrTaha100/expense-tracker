import api from '../api/axios';

export default function ExpenseList({ expenses, onDeleted }) {
  const handleDelete = async (id) => {
    if (!confirm('متأكد من الحذف؟')) return;
    try {
      await api.delete(`/expenses/${id}`);
      onDeleted(id);
    } catch (err) {
      alert('فشل الحذف');
    }
  };

  if (expenses.length === 0) {
    return <p className="empty-state">لسه معملتش أي مصروف. ضيف أول واحد من الفورم فوق.</p>;
  }

  return (
    <table className="expense-table">
      <thead>
        <tr>
          <th>التاريخ</th>
          <th>الفئة</th>
          <th>المبلغ</th>
          <th>ملاحظة</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((exp) => (
          <tr key={exp._id}>
            <td>{new Date(exp.date).toLocaleDateString('ar-EG')}</td>
            <td>{exp.category}</td>
            <td>{exp.amount} ج.م</td>
            <td>{exp.note || '-'}</td>
            <td>
              <button className="delete-btn" onClick={() => handleDelete(exp._id)}>حذف</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
