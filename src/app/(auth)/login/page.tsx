// src/app/(auth)/login/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card'
import { LoginForm } from '@/components/organisms/LoginForm'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Bine ai revenit!</CardTitle>
          <CardDescription>Introdu credențialele pentru a accesa contul.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
