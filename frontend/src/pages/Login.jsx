import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  const { login }=useAuth(); const navigate=useNavigate();
  const submit=async(e)=>{e.preventDefault();setError('');setLoading(true);try{await login(email,password);navigate('/dashboard')}catch(err){setError(err.response?.data?.message||'الإيميل أو كلمة السر غير صحيحة.')}finally{setLoading(false)}};
  return <div className="auth-page">
    <div className="auth-decoration"><span>EXPENSE<br/><b>TRACKER</b></span><i>“</i><p>خلي فلوسك تحت السيطرة،<br/>قرار ورا قرار.</p></div>
    <div className="auth-brand"><span className="brand-mark large">ج</span><strong>ExpenseTracker</strong></div>
    <form className="auth-form" onSubmit={submit}>
      <div className="auth-heading"><span className="eyebrow">مرحبًا بعودتك</span><h1>تسجيل الدخول</h1><p>كمّل من حيث توقفت.</p></div>
      {error&&<p className="error" role="alert">{error}</p>}
      <label className="auth-field"><span>البريد الإلكتروني</span><input type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required/></label>
      <label className="auth-field"><span>كلمة السر</span><input type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required/></label>
      <button type="submit" disabled={loading}>{loading?'جاري الدخول...':'دخول إلى حسابي  →'}</button>
      <p className="auth-switch">معندكش حساب؟ <Link to="/register">أنشئ حساب جديد</Link></p>
    </form>
  </div>;
}