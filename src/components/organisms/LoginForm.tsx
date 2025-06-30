// src/components/features/auth/LoginForm.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/atoms/form'
import { Input } from '@/components/atoms/input'
import { SubmitButton } from '@/components/molecules/submit-button'
import { type SignInFormValues, signInSchema } from '@/core/domains/auth/auth.types'
import { signInAction } from '@/features/auth/actions'
import { useActionForm } from '@/hooks/useActionForm'

export function LoginForm() {
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { formSubmit, isPending } = useActionForm({
    action: signInAction,
    // La succes, nu facem nimic special. Middleware-ul va prelua controlul.
    onSuccess: () => {
      // Pagina se va reîmprospăta automat, declanșând middleware-ul
      window.location.reload()
    },
  })

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
                <Input placeholder="nume@email.com" {...field} />
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
                <Input type="password" placeholder="••••••••" {...field} />
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
