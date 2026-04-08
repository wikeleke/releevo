import { SignUp } from '@clerk/clerk-react';
import { useSearchParams } from 'react-router-dom';

const Signup = () => {
  const [searchParams] = useSearchParams();
  const sellerIntent = searchParams.get('intent') === 'seller';

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <SignUp
        unsafeMetadata={sellerIntent ? { role: 'seller' } : undefined}
        afterSignUpUrl="/dashboard"
        afterSignInUrl="/dashboard"
        redirectUrl="/dashboard"
      />
    </div>
  );
};

export default Signup;
