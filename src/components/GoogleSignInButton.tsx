import { type TokenResponse, useGoogleLogin } from "@react-oauth/google";
import { Loader2, LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import { openArchiveFolderPicker } from "@/api/picker";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function GoogleSignInButton() {
  const { isSignedIn, signIn, signOut } = useAuth();
  const [isPending, setIsPending] = useState(false);

  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/drive.file",
    onSuccess: async (response: TokenResponse) => {
      setIsPending(true);
      try {
        await openArchiveFolderPicker(response.access_token);
        signIn(response.access_token, response.expires_in);
      } catch {
        // user cancelled the picker — token discarded
      } finally {
        setIsPending(false);
      }
    },
  });

  if (isSignedIn) {
    return (
      <Button variant="ghost" size="sm" className="gap-2" onClick={signOut}>
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    );
  }

  if (isPending) {
    return (
      <Button variant="outline" size="sm" className="gap-2" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
        Opening archive…
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={() => login()}
    >
      <LogIn className="h-4 w-4" />
      Sign in with Google
    </Button>
  );
}
