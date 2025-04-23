import { RegisterForm } from '@/components/auth/register-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Pencil } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="container flex flex-col items-center justify-center h-screen max-w-md mx-auto space-y-6 py-12">
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="flex items-center space-x-2">
          <Pencil className="h-6 w-6" />
          <span className="text-2xl font-bold">NoteBuddy</span>
        </div>
        <p className="text-muted-foreground">
          Your smart note-taking companion
        </p>
      </div>
      
      <RegisterForm />
      
      <div className="text-center text-sm text-muted-foreground">
        <p>
          By continuing, you agree to our{' '}
          <Link href="#" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="#" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}