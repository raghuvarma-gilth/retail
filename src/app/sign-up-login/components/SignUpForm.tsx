'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

interface SignUpFormValues {
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  storeType: string;
  currency: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

const storeTypes = [
  { value: 'general', label: 'General Store / Kirana' },
  { value: 'grocery', label: 'Grocery / Supermarket' },
  { value: 'pharmacy', label: 'Medical / Pharmacy' },
  { value: 'bakery', label: 'Bakery / Confectionery' },
  { value: 'stationery', label: 'Stationery & Books' },
  { value: 'other', label: 'Other Retail' },
];

export default function SignUpForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormValues>({ defaultValues: { currency: 'INR', storeType: 'general' } });

  const password = watch('password');

  const onSubmit = async (data: SignUpFormValues) => {
    setLoading(true);
    // Backend integration: POST /auth/register with store setup payload
    await new Promise((r) => setTimeout(r, 1400));
    toast.success(`${data.storeName} is ready! Loading your dashboard with demo data...`);
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Set up your store</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Free access · No credit card required · Demo data pre-loaded</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Store name */}
        <div>
          <label htmlFor="store-name" className="block text-sm font-medium text-foreground mb-1">
            Store Name <span className="text-danger">*</span>
          </label>
          <input
            id="store-name"
            type="text"
            placeholder="Sharma General Store"
            className={`w-full px-3 py-2.5 text-sm border rounded-md bg-card text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.storeName ? 'border-danger' : 'border-input'}`}
            {...register('storeName', { required: 'Store name is required', minLength: { value: 3, message: 'Minimum 3 characters' } })}
          />
          {errors.storeName && <p className="text-xs text-danger mt-1">{errors.storeName.message}</p>}
        </div>

        {/* Owner + Phone row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="owner-name" className="block text-sm font-medium text-foreground mb-1">
              Owner Name <span className="text-danger">*</span>
            </label>
            <input
              id="owner-name"
              type="text"
              placeholder="Rajesh Sharma"
              className={`w-full px-3 py-2.5 text-sm border rounded-md bg-card text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.ownerName ? 'border-danger' : 'border-input'}`}
              {...register('ownerName', { required: 'Owner name required' })}
            />
            {errors.ownerName && <p className="text-xs text-danger mt-1">{errors.ownerName.message}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
              Mobile Number
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2.5 text-sm border border-input rounded-md bg-card text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              {...register('phone')}
            />
          </div>
        </div>

        {/* City + Store type */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-foreground mb-1">
              City <span className="text-danger">*</span>
            </label>
            <input
              id="city"
              type="text"
              placeholder="Bangalore"
              className={`w-full px-3 py-2.5 text-sm border rounded-md bg-card text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.city ? 'border-danger' : 'border-input'}`}
              {...register('city', { required: 'City is required' })}
            />
            {errors.city && <p className="text-xs text-danger mt-1">{errors.city.message}</p>}
          </div>
          <div>
            <label htmlFor="store-type" className="block text-sm font-medium text-foreground mb-1">
              Store Type <span className="text-danger">*</span>
            </label>
            <select
              id="store-type"
              className="w-full px-3 py-2.5 text-sm border border-input rounded-md bg-card text-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              {...register('storeType')}
            >
              {storeTypes.map((t) => (
                <option key={`stype-${t.value}`} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-foreground mb-1">
            Email Address <span className="text-danger">*</span>
          </label>
          <p className="text-xs text-muted-foreground mb-1">Used for alerts and ML report delivery</p>
          <input
            id="signup-email"
            type="email"
            placeholder="rajesh@sharma-store.in"
            className={`w-full px-3 py-2.5 text-sm border rounded-md bg-card text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.email ? 'border-danger' : 'border-input'}`}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
            })}
          />
          {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-foreground mb-1">
            Password <span className="text-danger">*</span>
          </label>
          <p className="text-xs text-muted-foreground mb-1">Minimum 8 characters with at least one number</p>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              className={`w-full px-3 py-2.5 pr-10 text-sm border rounded-md bg-card text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.password ? 'border-danger' : 'border-input'}`}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
                pattern: { value: /^(?=.*[0-9])/, message: 'Must include at least one number' },
              })}
            />
            <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground mb-1">
            Confirm Password <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat your password"
              className={`w-full px-3 py-2.5 pr-10 text-sm border rounded-md bg-card text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${errors.confirmPassword ? 'border-danger' : 'border-input'}`}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (v) => v === password || 'Passwords do not match',
              })}
            />
            <button type="button" onClick={() => setShowConfirm((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-danger mt-1">{errors.confirmPassword.message}</p>}
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2">
          <input
            id="terms"
            type="checkbox"
            className="w-4 h-4 mt-0.5 rounded border-input accent-primary"
            {...register('terms', { required: 'You must accept the terms to continue' })}
          />
          <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
            I agree to the{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            RetailMind AI stores anonymized transaction data to power ML recommendations.
          </label>
        </div>
        {errors.terms && <p className="text-xs text-danger -mt-2">{errors.terms.message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
          style={{ minHeight: '42px' }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Setting up your store...
            </>
          ) : (
            'Create Store Account'
          )}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="text-primary font-semibold hover:underline">
          Sign in
        </button>
      </p>
    </div>
  );
}