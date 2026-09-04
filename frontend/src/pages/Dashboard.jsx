import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseChart from '../components/ExpenseChart';

const currency = new Intl.NumberFormat('ar-EG', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [expRes, statsRes] = await Promise.all([api.get('/expenses'), api.get('/expenses/stats')]);
      setExpenses(expRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdded = (newExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
    fetchData();
  };

  const handleDeleted = (id) => {
    setExpenses((prev) => prev.filter((e) => e._id !== id));
    fetchData();
  };

  const total = useMemo(() => expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0), [expenses]);
  const monthTotal = useMemo(() => {
    const now = new Date();
    return expenses.reduce((sum, e) => {
      const date = new Date(e.date);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        ? sum + Number(e.amount || 0) : sum;
    }, 0);
  }, [expenses]);
  const average = expenses.length ? total / expenses.length : 0;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">₤</span>
          <div><strong>ExpenseTracker</strong><span>إدارة مصاريفك ببساطة</span></div>
        </div>
        <div className="user-menu">
          <div className="user-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
          <div className="user-copy"><strong>{user?.name}</strong><span>{user?.email}</span></div>
          <button onClick={handleLogout} className="logout-btn" type="button">خروج</button>
        </div>
      </header>

      <main className="dashboard">
        <section className="hero">
          <div>
            <span className="eyebrow">لوحة التحكم</span>
            <h1>أهلاً، {user?.name?.split(' ')[0] || 'بك'} 👋</h1>
            <p>تابع إنفاقك وخليك مسيطر على مصاريفك.</p>
          </div>
          <div className="hero-badge">إدارة مالية أذكى</div>
        </section>

        <section className="stats-grid" aria-label="ملخص المصاريف">
          <article className="stat-card stat-primary"><div className="stat-icon">↗</div><div><span>إجمالي المصاريف</span><strong>{currency.format(total)} <small>ج.م</small></strong></div></article>
          <article className="stat-card"><div className="stat-icon">◷</div><div><span>هذا الشهر</span><strong>{currency.format(monthTotal)} <small>ج.م</small></strong></div></article>
          <article className="stat-card"><div className="stat-icon">#</div><div><span>عدد العمليات</span><strong>{expenses.length}</strong></div></article>
          <article className="stat-card"><div className="stat-icon">≈</div><div><span>متوسط العملية</span><strong>{currency.format(average)} <small>ج.م</small></strong></div></article>
        </section>

        <section className="dashboard-grid">
          <div className="main-column">
            <div className="section-heading">
              <div><span className="eyebrow">سجل المصاريف</span><h2>أضف مصروف جديد</h2></div>
              <span className="count-pill">{expenses.length} عملية</span>
            </div>
            <ExpenseForm onAdded={handleAdded} />
            {loading ? <div className="loading-card"><div className="spinner" /><span>بنجهز بياناتك...</span></div> : <ExpenseList expenses={expenses} onDeleted={handleDeleted} />}
          </div>
          <aside className="side-column">{!loading && <ExpenseChart stats={stats} />}</aside>
        </section>
      </main>
    </div>
  );
}
