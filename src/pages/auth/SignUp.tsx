import Logo from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '@/hooks/api/use-auth-mutations';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useUsernameCheck } from '@/hooks/api/use-username-check';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { PasswordInput } from '@/components/shared/PasswordInput';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{6,}$/;

const PASSWORD_MESSAGE = 'Password must be at least 6 characters and contain one uppercase letter, one lowercase letter, one number, and one special character.';

// Regex for letters, numbers, and underscores
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const USERNAME_MESSAGE = 'Username can only contain letters, numbers, and underscores';


const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  // 💥 NEW/UPDATED USERNAME ZOD RULE 💥
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .regex(USERNAME_REGEX, USERNAME_MESSAGE),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .regex(PASSWORD_REGEX, PASSWORD_MESSAGE),

  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [globalError, setGlobalError] = useState('');

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    control
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {

    // --- 💥 THE SOLUTION: Strip confirmPassword before submitting 💥 ---
    const { confirmPassword, ...payload } = data;

    // The 'payload' variable now contains only firstName, lastName, email, and password.
    // It matches the RegisterPayload type.

    register(payload);
  };

  const { mutate: register, isPending } = useRegister({ setError, setGlobalError });

  const usernameValue = watch('username');
  const { isChecking, isAvailable, isTakenError, isValidationError } = useUsernameCheck(usernameValue);

  // Determine the error message to display
  let apiErrorMessage = isValidationError || isTakenError;

  // Determine the border color
  const isInputInvalid = !!errors.username || !!apiErrorMessage;
  const isInputValid = !isInputInvalid && isAvailable === true && usernameValue.length > 2;

  const getErrorClass = (fieldName: keyof RegisterFormData) => {
    // Return Tailwind classes for red border/ring if an error exists for the field
    return errors[fieldName] ? 'border-red-500 focus-visible:ring-red-500' : '';
  };


  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"

      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <div aria-label="go home" className="mx-auto block w-fit">
              <Logo url="/" />
            </div>
            <h1 className="mb-1 mt-4 text-xl font-semibold">Create a Ura Account</h1>
            <p className="text-sm">Welcome! Create an account to get started</p>
          </div>

          <div className="mt-6 space-y-6">
            {globalError && (
              <p className="text-sm text-center font-medium text-red-500 bg-red-50 p-2 rounded">
                {globalError}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName" className={cn("block text-sm", errors.firstName && 'text-red-500')}>
                  First Name
                </Label>
                <Input
                  type="text"
                  id="firstName"
                  {...registerField('firstName')}
                  disabled={isPending}
                  className={cn(getErrorClass('firstName'))}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              {/* LAST NAME FIELD */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className={cn("block text-sm", errors.lastName && 'text-red-500')}>
                  Last Name
                </Label>
                <Input
                  type="text"
                  id="lastName"
                  {...registerField('lastName')}
                  disabled={isPending}
                  className={cn(getErrorClass('lastName'))}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* USERNAME FIELD */}
            <div className="space-y-2">
              <Label htmlFor="username" className={cn("block text-sm", errors.username && 'text-red-500')}>
                Username
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  id="username"
                  {...registerField('username')}
                  disabled={isPending}
                  className={cn(
                    isChecking && 'border-yellow-500',
                    isAvailable === false && 'border-red-500',
                    isAvailable === true && 'border-green-500'
                  )}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isChecking && <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />}
                  {!isChecking && isAvailable === true && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  {!isChecking && isAvailable === false && <XCircle className="h-4 w-4 text-red-500" />}
                </div>
              </div>

              {/* Error Messages */}
              {errors.username?.message && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  {errors.username.message}
                </p>
              )}

              {!errors.username?.message && apiErrorMessage && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  {apiErrorMessage}
                </p>
              )}
            </div>


            {/* EMAIL FIELD */}
            <div className="space-y-2">
              <Label htmlFor="email" className={cn("block text-sm", errors.email && 'text-red-500')}>
                Email
              </Label>
              <Input
                type="email"
                id="email"
                {...registerField('email')}
                disabled={isPending}
                className={cn(getErrorClass('email'))}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* PASSWORD FIELD */}
            <div className="space-y-0.5">
              <Label htmlFor="password" className={cn("text-sm", errors.password && 'text-red-500')}>
                Password
              </Label>
              <PasswordInput
                id="password"
                {...registerField('password')}
                disabled={isPending}
                className={cn(getErrorClass('password'))}
              />

              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {/* CONFIRM PASSWORD FIELD */}
            <div className="space-y-0.5">
              <Label htmlFor="confirmPassword" className={cn("text-sm", errors.password && 'text-red-500')}>
                Confrim Password
              </Label>
              <PasswordInput
                id="confirmPassword"
                {...registerField('confirmPassword')}
                disabled={isPending}
                className={cn(getErrorClass('password'))}
              />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>

          <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <hr className="border-dashed" />
            <span className="text-muted-foreground text-xs">Or continue With</span>
            <hr className="border-dashed" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.98em"
                height="1em"
                viewBox="0 0 256 262"
              >
                <path
                  fill="#4285f4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                ></path>
                <path
                  fill="#34a853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                ></path>
                <path
                  fill="#fbbc05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                ></path>
                <path
                  fill="#eb4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                ></path>
              </svg>
              <span>Google</span>
            </Button>
            <Button type="button" variant="outline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="1em"
                height="1em"
                viewBox="0 0 256 256"
              >
                <path fill="#f1511b" d="M121.666 121.666H0V0h121.666z"></path>
                <path fill="#80cc28" d="M256 121.666H134.335V0H256z"></path>
                <path fill="#00adef" d="M121.663 256.002H0V134.336h121.663z"></path>
                <path fill="#fbbc09" d="M256 256.002H134.335V134.336H256z"></path>
              </svg>
              <span>Microsoft</span>
            </Button>
          </div>
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Have an account ?
            <Button asChild variant="link" className="px-2">
              <Link to="/auth/login">Sign In</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}

