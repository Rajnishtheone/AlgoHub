import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { clearError, registerUser } from '../authSlice';

const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak")
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    dispatch(clearError());
    if (isAuthenticated) {
      navigate('/');
    }
  }, [dispatch, isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="auth-sky flex items-center justify-center p-6">
      <div className="auth-card grid md:grid-cols-2">
        <div className="auth-panel p-8 md:p-12 flex flex-col items-center justify-center text-center gap-6">
          <div className="text-xs tracking-[0.35em] uppercase">AlgoHub</div>
          <div className="auth-rocket w-40 h-40">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <linearGradient id="rocketGlowSignup" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#8cf2ff" />
                  <stop offset="100%" stopColor="#7c4dff" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="70" fill="rgba(255,255,255,0.08)" />
              <path d="M100 30c24 20 36 46 36 78 0 32-12 58-36 78-24-20-36-46-36-78 0-32 12-58 36-78z" fill="#f5f1ff" />
              <circle cx="100" cy="90" r="17" fill="#3b1c6e" />
              <circle cx="100" cy="90" r="8" fill="#8cf2ff" />
              <path d="M68 132l-24 20c-6 5-8 11-6 18 8-5 18-7 30-5l10-33z" fill="#e7dcff" />
              <path d="M132 132l24 20c6 5 8 11 6 18-8-5-18-7-30-5l-10-33z" fill="#e7dcff" />
              <path className="rocket-flame" d="M92 152h16l-8 24z" fill="url(#rocketGlowSignup)" />
              <circle className="rocket-spark" cx="88" cy="176" r="2.5" fill="#b9f7ff" />
              <circle className="rocket-spark" cx="114" cy="180" r="2" fill="#9b7dff" />
            </svg>
          </div>
          <div className="auth-code">
            <span className="code-line">const path = optimalRoute(grid);</span>
            <span className="code-line delay-1">return path.length &gt; 0;</span>
            <span className="code-line delay-2">// keep iterating</span>
          </div>
          <div className="auth-motto">Practice your code. Learn more. Grow fast.</div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Start your journey</h3>
            <p className="text-sm text-white/80">
              Join AlgoHub and start shipping clean solutions today.
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <h2 className="text-2xl font-bold text-slate-900">Create account</h2>
          <p className="text-sm text-slate-500 mt-2">Sign up to unlock your problem set.</p>

          {error && (
            <div className="alert alert-error mt-6">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
            <div>
              <label className="auth-label">First Name</label>
              <input
                type="text"
                placeholder="John"
                className={`auth-input ${errors.firstName ? 'auth-input-error' : ''}`}
                {...register('firstName')}
              />
              {errors.firstName && (
                <span className="text-error text-sm mt-2 block">{errors.firstName.message}</span>
              )}
            </div>

            <div>
              <label className="auth-label">Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                className={`auth-input ${errors.emailId ? 'auth-input-error' : ''}`}
                {...register('emailId')}
              />
              {errors.emailId && (
                <span className="text-error text-sm mt-2 block">{errors.emailId.message}</span>
              )}
            </div>

            <div>
              <label className="auth-label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  className={`auth-input pr-10 ${errors.password ? 'auth-input-error' : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-1 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-error text-sm mt-2 block">{errors.password.message}</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className={`auth-btn ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
              <span className="text-sm text-slate-500">
                Already have an account?{' '}
                <NavLink to="/login" className="auth-link">
                  Login
                </NavLink>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
