import { SignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  return (
    <SignIn
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/onboarding"
      redirectUrl="/dashboard"
      onSignIn={() => navigate('/dashboard')}
    />
  );
};

export default Login;
