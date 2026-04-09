import { SignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-md justify-center">
        <SignIn
          afterSignInUrl="/dashboard"
          afterSignUpUrl="/onboarding"
          redirectUrl="/dashboard"
          signUpUrl="/signup"
          onSignIn={() => navigate('/dashboard')}
        />
      </div>
    </div>
  );
};

export default Login;
