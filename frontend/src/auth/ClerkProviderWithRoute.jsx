import { ClerkProvider } from "@clerk/clerk-react";
import { dark, light } from "@clerk/themes";
import { useTheme } from '../layout/useTheme';


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

export default function ClerkProviderWithRoutes({ children }) {
  const { darkMode } = useTheme();

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: darkMode ? dark : light,
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
