import { useState, useEffect } from "react";

import { useGoogleAuthContext } from "./GoogleAuthProvider";

export const useUsers = () => {
  const context = useGoogleAuthContext();
  const [currentUser, setCurrentUser] = useState(
    context?.googleAuth?.currentUser?.get() || null
  );

  if (!context) {
    throw Error("Must use `useUsers` inside of `GoogleAuthProvider`");
  }

  // Listen for changes in the current user's sign-in state.
  useEffect(() => {
    context.googleAuth?.currentUser.listen(setCurrentUser);
  }, [context.googleAuth]);

  return {
    errors: context.errors,
    currentUser,
    id: currentUser?.getId(),
    isSignedIn: currentUser?.isSignedIn(),
    hostedDomain: currentUser?.getHostedDomain(),
    grantedScopes: currentUser?.getGrantedScopes(),
    basicProfile: currentUser?.getBasicProfile(),
    getAuthResponse: currentUser?.getAuthResponse.bind(currentUser),
    reloadAuthResponse: currentUser?.reloadAuthResponse.bind(currentUser),
    hasGrantedScopes: currentUser?.hasGrantedScopes.bind(currentUser),
    grant: currentUser?.grant.bind(currentUser),
    grantOfflineAccess: currentUser?.grantOfflineAccess.bind(currentUser),
    disconnect: currentUser?.disconnect.bind(currentUser),
  };
};
