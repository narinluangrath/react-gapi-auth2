import { useState, useEffect } from "react";

import { useGoogleAuthContext } from "./GoogleAuthProvider";

export const useAuthentication = () => {
  const context = useGoogleAuthContext();
  const [isSignedIn, setIsSignedIn] = useState(
    context?.googleAuth?.isSignedIn?.get() || false
  );

  if (!context) {
    throw Error("Must use `useAuthentication` inside of `GoogleAuthProvider`");
  }

  // Listen for changes in the current user's sign-in state.
  useEffect(() => {
    context.googleAuth?.isSignedIn.listen(setIsSignedIn);
  }, [context.googleAuth]);

  return {
    errors: context.errors,
    isSignedIn,
    signIn: context.googleAuth?.signIn.bind(context.googleAuth),
    signOut: context.googleAuth?.signOut.bind(context.googleAuth),
    disconnect: context.googleAuth?.disconnect.bind(context.googleAuth),
    grantOfflineAccess: context.googleAuth?.grantOfflineAccess.bind(
      context.googleAuth
    ),
    attachClickHandler: context.googleAuth?.attachClickHandler.bind(
      context.googleAuth
    ),
  };
};
