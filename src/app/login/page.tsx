"use client"
import { LoginLayout } from '../../features/login/components/Layout';
import LoginForm from '../../features/login/components/Form';

export default function LoginPage() {
  return (
    <LoginLayout>
      <LoginForm />
    </LoginLayout>
  );
}