import { SignUp } from '@clerk/clerk-react';
import { useSearchParams } from 'react-router-dom';

const Signup = () => {
  const [searchParams] = useSearchParams();
  const intent = searchParams.get('intent');
  const afterSignUpUrl =
    intent === 'seller' || intent === 'buyer'
      ? `/onboarding?intent=${encodeURIComponent(intent)}`
      : '/onboarding';

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <SignUp
        afterSignUpUrl={afterSignUpUrl}
        afterSignInUrl="/dashboard"
        redirectUrl={afterSignUpUrl}
        signInUrl="/login"
      />
    </div>
  );
};

export default Signup;
