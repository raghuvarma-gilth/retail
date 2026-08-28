'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, Copy, Check } from 'lucide-react';


interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface DemoAccount {
  id: string;
  role: string;
  storeName: string;
  email: string;
  password: string;
  description: string;
}

const demoAccounts: DemoAccount[] = [
  {
    id: 'demo-general',
    role: 'General Store',
    storeName: 'Sharma General Store',
    email: 'rajesh@sharma-store.in',
    password: 'demo@retailmind2026',
    description: 'Full dataset: 342 SKUs, 14 months history',
  },
  {
    id: 'demo-grocery',
    role: 'Grocery Chain',
    storeName: 'Patel Fresh Mart',
    email: 'amit@patelfresh.in',
    password: 'demo@retailmind2026',
    description: 'Multi-category: 480 SKUs, festival data',
  },
  {
    id: 'demo-pharmacy',
    role: 'Medical Store',
    storeName: 'Nair Medical & General',
    email: 'priya@nairmedical.in',
    password: 'demo@retailmind2026',
    description: 'High expiry risk: 210 SKUs, batch tracking',
  },
];

export default function LoginForm({ onSwitchToSignup }: { onSwitchToSignup: () => void }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({ defaultValues: { rememberMe: false } });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    // Backend integration: POST /auth/login with { email, password }
    await new Promise((r) => setTimeout(r, 1200));
    const validCredentials = demoAccounts.some(
      (d) => d.email === data.email && d.password === data.password
    );
    if (!validCredentials) {
      setLoading(false);
      toast.error('Invalid credentials — use the demo accounts below to sign in');
      return;
    }
    toast.success('Welcome back! Loading your store dashboard...');
    setLoading(false);
    router.push('/');
  };

  const handleDemoLogin = (account: DemoAccount) => {
    setValue('email', account.email);
    setValue('password', account.password);
    toast.info(`Demo credentials loaded for ${account.storeName}`);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Sign in to your RetailMind AI store</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-foreground mb-1">
            Store Email Address
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="rajesh@sharma-store.in"
            className={`w-full px-3 py-2.5 text-sm border rounded-md bg-card text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/20 focus:border-primary ${
              errors.email ? 'border-danger' : 'border-input'
            }`}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
            })}
          />
          {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="login-password" className="block text-sm font-medium text-foreground">
              Password
            </label>
            <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              className={`w-full px-3 py-2.5 pr-10 text-sm border rounded-md bg-card text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                errors.password ? 'border-danger' : 'border-input'
              }`}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2">
          <input
            id="remember-me"
            type="checkbox"
            className="w-4 h-4 rounded border-input accent-primary"
            {...register('rememberMe')}
          />
          <label htmlFor="remember-me" className="text-sm text-muted-foreground">
            Keep me signed in for 30 days
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
          style={{ minHeight: '42px' }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Signing you in...
            </>
          ) : (
            'Sign In to RetailMind AI'
          )}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-xs text-muted-foreground">or try a demo account</span>
        </div>
      </div>

      {/* Demo accounts */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Demo Store Accounts</p>
        {demoAccounts.map((account) => (
          <div
            key={account.id}
            className="border border-border rounded-lg p-3 hover:border-primary/40 hover:bg-muted/40 transition-colors cursor-pointer"
            onClick={() => handleDemoLogin(account)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">{account.storeName}</span>
                  <span className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded font-medium">
                    {account.role}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{account.description}</p>
                <p className="text-[11px] text-muted-foreground mt-1 font-mono truncate">{account.email}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleCopy(account.email, `email-${account.id}`); }}
                  className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors"
                  title="Copy email"
                >
                  {copiedField === `email-${account.id}` ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleDemoLogin(account); }}
                  className="text-[11px] font-semibold text-primary hover:underline px-1"
                >
                  Use →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        New to RetailMind AI?{' '}
        <button onClick={onSwitchToSignup} className="text-primary font-semibold hover:underline">
          Create your store account
        </button>
      </p>
    </div>
  );
}