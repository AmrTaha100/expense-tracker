import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name,setName]=useState('');const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [error,setError]=useState('');const [loading,setLoading]=useState(false);
  const { register }=useAuth();const navigate=useNavigate();
  const submit=async(e)=>{e.preventDefault();setError('');setLoading(true);try{await register(name,email,password);navigate('/dashboard')}catch(err){setError(err.response?.data?.message||'حصل خطأ أثناء إنشاء الحساب.')}finally{setLoading(false)}};
  return <div className="auth-page">
    <div className="auth-decoration"><span>BUILD YOUR<br/><b>BETTER HABITS</b></span><i>+</i><p>سجّل مصاريفك.<br/>افهم عاداتك. ووفّر أكتر.</p></div>
    <div className="auth-brand"><span className="brand-mark large">ج</span><strong>ExpenseTracker</strong></div>
    <form className="auth-form" onSubmit={submit}>
      <div className="auth-heading"><span className="eyebrow">خطوة صغيرة، فرق كبير</span><h1>إنشاء حساب</h1><p>ابدأ تنظيم مصاريفك من النهارده.</p></div>
      {error&&<p className="error" role="alert">{error}</p>}
      <label className="auth-field"><span>الاسم</span><input type="text" placeholder="اسمك" value={name} onChange={e=>setName(e.target.value)} autoComplete="name" required/></label>
      <label className="auth-field"><span>البريد الإلكتروني</span><input type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required/></label>
      <label className="auth-field"><span>كلمة السر</span><input type="password" placeholder="6 أحرف على الأقل" value={password} onChange={e=>setPassword(e.target.value)} minLength={6} autoComplete="new-password" required/></label>
      <button type="submit" disabled={loading}>{loading?'جاري إنشاء الحساب...':'ابدأ الآن  →'}</button>
      <p className="auth-switch">عندك حساب بالفعل؟ <Link to="/login">سجّل دخول</Link></p>
    </form>
  </div>;
}