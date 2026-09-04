import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseChart from '../components/ExpenseChart';

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [expRes, statsRes] = await Promise.all([
        api.get('/expenses'),
        api.get('/expenses/stats'),
      ]);
      setExpenses(expRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdded = (newExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
    fetchData(); // نحدث الإحصائيات كمان
  };

  const handleDeleted = (id) => {
    setExpenses((prev) => prev.filter((e) => e._id !== id));
    fetchData();
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>أهلاً، {user?.name}</h1>
        <button onClick={handleLogout} className="logout-btn">تسجيل خروج</button>
      </header>

      <div className="summary-card">
        <span>إجمالي المصاريف</span>
        <strong>{total.toFixed(2)} ج.م</strong>
      </div>

      <ExpenseForm onAdded={handleAdded} />

      {loading ? (
        <p>جاري التحميل...</p>
      ) : (
        <>
          <ExpenseChart stats={stats} />
          <ExpenseList expenses={expenses} onDeleted={handleDeleted} />
        </>
      )}
    </div>
  );
}
