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
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true);
    try {
      const [expRes, statsRes] = await Promise.all([api.get('/expenses'), api.get('/expenses/stats')]);
      setExpenses(expRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdded = (newExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
    fetchData(true);
  };

  const handleDeleted = (id) => {
    setExpenses((prev) => prev.filter((e) => e._id !== id));
    fetchData(true);
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
  const highestExpense = expenses.length ? Math.max(...expenses.map((e) => Number(e.amount || 0))) : 0;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">ج</span>
          <div><strong>ExpenseTracker</strong><span>إدارة مصاريفك ببساطة</span></div>
        </div>
        <div className="user-menu">
          <div className="user-copy"><strong>{user?.name}</strong><span>{user?.email}</span></div>
          <div className="user-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
          <button onClick={handleLogout} className="logout-btn" type="button">خروج <span>↪</span></button>
        </div>
      </header>

      <main className="dashboard">
        <section className="hero-banner">
          <div className="hero-copy">
            <span className="hero-kicker">لوحة التحكم الشخصية</span>
            <h1>أهلاً، {user?.name?.split(' ')[0] || 'بك'} 👋</h1>
            <p>كل مصروف تسجله هنا بيخليك أقرب لفهم فلوسك والتحكم فيها.</p>
            <div className="hero-actions">
              <span className="hero-status"><i /> حسابك متصل وآمن</span>
              <span className="hero-date">{new Intl.DateTimeFormat('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}</span>
            </div>
          </div>
          <div className="hero-total">
            <span>إجمالي الإنفاق</span>
            <strong>{currency.format(total)} <small>ج.م</small></strong>
            <em>{expenses.length ? expenses.length + ' عملية مسجلة' : 'لسه مفيش مصاريف'}</em>
          </div>
          <div className="hero-orb hero-orb-one" />
          <div className="hero-orb hero-orb-two" />
        </section>

        <section className="stats-grid" aria-label="ملخص المصاريف">
          <article className="stat-card">
            <div className="stat-icon">◷</div>
            <div><span>مصروفات الشهر</span><strong>{currency.format(monthTotal)} <small>ج.م</small></strong><em>الشهر الحالي</em></div>
          </article>
          <article className="stat-card">
            <div className="stat-icon">#</div>
            <div><span>عدد العمليات</span><strong>{expenses.length}</strong><em>عملية مسجلة</em></div>
          </article>
          <article className="stat-card">
            <div className="stat-icon">↔</div>
            <div><span>متوسط العملية</span><strong>{currency.format(average)} <small>ج.م</small></strong><em>لكل مصروف</em></div>
          </article>
          <article className="stat-card stat-highlight">
            <div className="stat-icon">◆</div>
            <div><span>أعلى مصروف</span><strong>{currency.format(highestExpense)} <small>ج.م</small></strong><em>أكبر عملية مسجلة</em></div>
          </article>
        </section>

        <section className="dashboard-grid">
          <div className="main-column">
            <div className="section-heading">
              <div><span className="eyebrow">إضافة سريعة</span><h2>سجّل مصروف جديد</h2></div>
              <span className="count-pill">⚡ بدون تعقيد</span>
            </div>
            <ExpenseForm onAdded={handleAdded} />
            {loading ? (
              <div className="loading-card"><div className="spinner" /><span>بنجهز بياناتك...</span></div>
            ) : (
              <ExpenseList expenses={expenses} onDeleted={handleDeleted} />
            )}
          </div>

          <aside className="side-column">
            {!loading && (
              <>
                <div className="side-heading">
                  <div><span className="eyebrow">رؤية أوضح</span><h2>فين فلوسك بتروح؟</h2></div>
                  <span>آخر البيانات</span>
                </div>
                <ExpenseChart stats={stats} />
              </>
            )}
            {refreshing && <div className="sync-note"><span className="spinner mini" /> جاري تحديث الأرقام...</div>}
          </aside>
        </section>
      </main>
    </div>
  );
}
