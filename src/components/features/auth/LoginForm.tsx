// src/components/features/auth/LoginForm.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { SubmitButton } from '@/components/shared/SubmitButton'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AUTH_MESSAGES, type SignInFormData, SignInFormValidator } from '@/core/domains/auth'
import { signInAction } from '@/features/auth/actions'
import { useActionForm } from '@/hooks/useActionForm'

export function LoginForm() {
  const router = useRouter()

  const form = useForm<SignInFormData>({
    resolver: zodResolver(SignInFormValidator),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { formSubmit, isPending } = useActionForm({
    action: signInAction,
    onSuccess: () => {
      router.refresh()
    },
    onError: ({ validationErrors }) => {
      if (validationErrors) {
        Object.entries(validationErrors).forEach(([field, messages]) => {
          form.setError(field as keyof SignInFormData, {
            type: 'server',
            message: messages?.[0],
          })
        })
      }
    },
    toastMessages: {
      loading: 'Se verifică credențialele...',
      error: AUTH_MESSAGES.SERVER.INVALID_CREDENTIALS.message,
    },
  })

  // Am eliminat `div`-urile exterioare. Componenta returnează direct formularul.
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="nume@email.com" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parolă</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" autoComplete="current-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton isPending={isPending} className="w-full">
          Autentificare
        </SubmitButton>
      </form>
    </Form>
  )
}
