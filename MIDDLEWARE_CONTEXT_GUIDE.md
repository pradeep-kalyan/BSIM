# Middleware and Context System

This document explains the middleware and context system implemented for the Business Simulation Platform.

## Overview

The system consists of:

1. **Next.js Middleware** - Route protection and authentication
2. **Context Providers** - Global state management
3. **Server Context** - Access user data in server components
4. **Auth Guards** - Component-level protection

## Middleware (`app/middleware.ts`)

The middleware handles:

- Authentication verification using JWT tokens
- Route protection for authenticated/unauthenticated users
- Automatic redirects based on auth status
- User data injection into request headers

### Protected Routes

- `/homepage/*` - Main application dashboard
- `/management/*` - Management tools
- `/market/*` - Market analysis
- `/performance/*` - Performance metrics
- `/products/*` - Product management
- `/profile/*` - User profile
- `/simulations/*` - Simulation management

### Auth Routes (redirect if authenticated)

- `/login` - Login page
- `/register` - Registration page

### Usage Example

The middleware runs automatically. No additional setup required.

## Context Providers

### 1. AuthContext (`app/context/AuthContext.tsx`)

Manages user authentication state.

```tsx
import { useAuth } from "@/app/context";

function MyComponent() {
  const { user, loading, login, logout, updateUser } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return <div>Welcome, {user.name}!</div>;
}
```

### 2. SimulationContext (`app/context/SimulationContext.tsx`)

Manages companies and simulations.

```tsx
import { useSimulation } from "@/app/context";

function CompanyList() {
  const { state, actions } = useSimulation();

  useEffect(() => {
    actions.loadCompanies();
  }, []);

  return (
    <div>
      {state.companies.map((company) => (
        <div key={company.id} onClick={() => actions.selectCompany(company)}>
          {company.name}
        </div>
      ))}
    </div>
  );
}
```

### 3. GameContext (`app/context/GameContext.tsx`)

Manages game state, decisions, and metrics.

```tsx
import { useGame } from "@/app/context";

function GameMetrics() {
  const { state, actions } = useGame();

  return (
    <div>
      <h3>Period {state.currentPeriod}</h3>
      <p>Revenue: ${state.metrics.revenue.toLocaleString()}</p>
      <p>Status: {state.gameStatus}</p>

      {state.gameStatus === "NOT_STARTED" && (
        <button onClick={actions.startGame}>Start Game</button>
      )}
    </div>
  );
}
```

## Server Context (`app/context/ServerUserContext.ts`)

Access user data in server components and server actions.

```tsx
import {
  getServerUser,
  requireServerUser,
} from "@/app/context/ServerUserContext";

// In a server component
async function ServerComponent() {
  const user = await getServerUser();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return <div>Server-side welcome, {user.name}!</div>;
}

// In a server action
async function myAction() {
  "use server";

  const user = await requireServerUser(); // Throws if not authenticated
  // ... perform action with authenticated user
}
```

## Auth Guards

### Component-level Protection

```tsx
import { AuthGuard } from "@/app/components/AuthGuard";

function ProtectedPage() {
  return (
    <AuthGuard>
      <div>This content is only visible to authenticated users</div>
    </AuthGuard>
  );
}

function LoginPage() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/homepage">
      <div>Login form - redirects to homepage if already authenticated</div>
    </AuthGuard>
  );
}
```

### Hook-based Protection

```tsx
import {
  useRequireAuth,
  useRedirectIfAuthenticated,
} from "@/app/hooks/useRequireAuth";

function ProtectedComponent() {
  const { user, loading } = useRequireAuth();

  if (loading) return <div>Loading...</div>;

  return <div>Protected content for {user.name}</div>;
}

function AuthComponent() {
  const { user, loading } = useRedirectIfAuthenticated();

  if (loading) return <div>Loading...</div>;

  return <div>Auth form</div>;
}
```

## API Routes

### Authentication Status

- `GET /api/auth/me` - Get current user data
- `POST /api/auth/logout` - Logout and clear cookies

### Example Usage

```tsx
// Check auth status
const response = await fetch("/api/auth/me");
if (response.ok) {
  const user = await response.json();
  console.log("Current user:", user);
}

// Logout
await fetch("/api/auth/logout", { method: "POST" });
```

## Setup Instructions

1. **Environment Variables**: Ensure `JWT_SECRET` is set in your environment
2. **Context Providers**: Already added to `app/layout.tsx`
3. **Middleware**: Automatically runs for all routes
4. **Usage**: Import and use hooks/components as needed

## Best Practices

1. **Server Components**: Use `getServerUser()` for optional auth, `requireServerUser()` for required auth
2. **Client Components**: Use `useAuth()` hook for auth state
3. **Route Protection**: Let middleware handle redirects, use AuthGuard for component-level protection
4. **Error Handling**: All context actions include error handling and loading states
5. **Type Safety**: All contexts are fully typed with TypeScript

## Cookie Management

The system uses HTTP-only cookies for security:

- Cookie name: `token`
- Expires: 30 minutes (configurable in JWT function)
- Secure: Only in production
- SameSite: `lax`

## Security Features

1. **JWT Verification**: All tokens are verified server-side
2. **HTTP-only Cookies**: Prevents XSS attacks
3. **Route Protection**: Middleware blocks unauthorized access
4. **CSRF Protection**: SameSite cookie attribute
5. **Secure Cookies**: HTTPS-only in production
