import React from 'react';
import { Loader2 } from 'lucide-react';
import { UserProfile, RedirectToSignIn, useAuth } from '@clerk/clerk-react';

/**
 * Página de ajustes Clerk: usar basePath único por ruta (/cuenta vs /perfil).
 */
export default function UserSettings({ basePath }) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-[#F8F9FE]">
        <Loader2 className="h-10 w-10 text-[#111124] animate-spin" aria-hidden />
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn redirectUrl={basePath} />;
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] w-full flex justify-center px-4 py-8 sm:py-12 bg-[#F8F9FE]">
      <UserProfile
        routing="path"
        path={basePath}
        appearance={{
          elements: {
            card: 'shadow-lg border border-[#E8E9EF] rounded-2xl',
            navbar: 'rounded-l-2xl',
          },
        }}
      />
    </div>
  );
}
