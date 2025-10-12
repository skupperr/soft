import React, { useEffect } from 'react';
import { SignIn, SignedOut } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function SignInPage() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="auth-container h-screen w-screen bg-[#111418]">
      <SignedOut>
        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
      </SignedOut>
    </div>
  );
}
