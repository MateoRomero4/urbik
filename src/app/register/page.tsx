import { RegisterLayout } from '../../features/register/components/Layout';
import RegisterForm from '../../features/register/components/Form';

export default function RegisterPage() {
  
  return (
    <RegisterLayout>
      <div className="w-full md:w-2/5 lg:w-2/5 p-8 md:p-12 flex flex-col justify-center h-full overflow-y-auto">
        <RegisterForm />
      </div>
    </RegisterLayout>
  );
}