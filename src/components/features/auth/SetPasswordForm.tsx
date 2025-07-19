'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { SubmitButton } from '@/components/shared/SubmitButton'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { type SetPasswordFormData,SetPasswordFormValidator } from '@/core/domains/auth'
import { createClient } from '@/lib/supabase/client'

export function SetPasswordForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const form = useForm<SetPasswordFormData>({
    resolver: zodResolver(SetPasswordFormValidator),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  function extractTokensFromUrl() {
    if (typeof window === 'undefined')
      return {
        token: null,
        token_hash: null,
        access_token: null,
        refresh_token: null,
        type: null,
        next: null,
      }

    console.log('🔍 URL actual:', window.location.href)
    console.log('🔍 Search params:', window.location.search)
    console.log('🔍 Hash:', window.location.hash)

    // Încearcă să extragă din query parameters (pentru invitații cu query params)
    const searchParams = new URLSearchParams(window.location.search)
    const queryTokens = {
      token: searchParams.get('token'), // Pentru invitații clasice
      token_hash: searchParams.get('token_hash'), // Pentru alte flow-uri
      type: searchParams.get('type'),
      access_token: searchParams.get('access_token'),
      refresh_token: searchParams.get('refresh_token'),
      next: searchParams.get('next'),
    }

    console.log('🔍 Token-uri din query params:', queryTokens)

    // Extrage din hash (pentru majoritatea flow-urilor)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const hashTokens = {
      token: hashParams.get('token'),
      token_hash: hashParams.get('token_hash'),
      access_token: hashParams.get('access_token'),
      refresh_token: hashParams.get('refresh_token'),
      type: hashParams.get('type'),
      next: hashParams.get('next'),
    }

    console.log('🔍 Token-uri din hash:', hashTokens)

    // Prioritizează query params dacă avem token sau token_hash acolo
    if (queryTokens.token || queryTokens.token_hash) {
      console.log('✅ Folosesc token-uri din query params')
      return queryTokens
    }

    // Altfel, folosește hash-ul (toate celelalte flow-uri)
    console.log('✅ Folosesc token-uri din hash')
    return hashTokens
  }

  async function onSubmit(values: SetPasswordFormData) {
    setServerError(null)
    setIsPending(true)
    try {
      const supabase = createClient()

      console.log('🚀 Încep procesul de setare parolă')

      // Verificăm mai întâi dacă utilizatorul este deja autentificat
      const {
        data: { user },
        error: getUserError,
      } = await supabase.auth.getUser()

      if (getUserError) {
        console.error('❌ Eroare la obținerea utilizatorului:', getUserError)
      }

      console.log('👤 Utilizator curent:', { isAuthenticated: !!user, email: user?.email })

      if (user) {
        // Utilizatorul este deja autentificat, setăm direct parola
        console.log('✅ Utilizator deja autentificat, setez parola direct')

        const { error: updateError } = await supabase.auth.updateUser({ password: values.password })
        if (updateError) {
          console.error('❌ Eroare la setarea parolei:', updateError)
          setServerError(updateError.message)
          setIsPending(false)
          return
        }

        console.log('✅ Parola setată cu succes pentru utilizatorul autentificat')
        // Redirect la login după setarea parolei
        router.push('/auth/login')
        return
      }

      // Dacă utilizatorul nu este autentificat, procesăm token-urile din URL
      console.log('🔍 Utilizatorul nu este autentificat, procesez token-urile din URL...')
      const { access_token, refresh_token, token, token_hash, type, next } = extractTokensFromUrl()

      console.log('🚀 Token-uri extrase:', {
        access_token: !!access_token,
        refresh_token: !!refresh_token,
        token: !!token,
        token_hash: !!token_hash,
        type,
        next,
      })

      // Pentru invitații cu token_hash sau conversie din token la token_hash
      if ((token || token_hash) && type === 'invite') {
        console.log('🎯 Flow pentru invitație cu token/token_hash')

        // Pentru token-ul clasic din URL, îl tratăm ca token_hash
        const finalTokenHash = token_hash || token

        if (!finalTokenHash) {
          setServerError('Token de invitație invalid.')
          setIsPending(false)
          return
        }

        console.log('🔐 Verific cu token_hash')
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: finalTokenHash,
          type: 'invite',
        })

        if (verifyError) {
          console.error('❌ Eroare la verificarea OTP:', verifyError)
          setServerError('Link-ul de invitație este invalid sau a expirat. Contactează administratorul.')
          setIsPending(false)
          return
        }

        console.log('✅ OTP verificat cu succes')

        // Setează parola nouă
        const { error: updateError } = await supabase.auth.updateUser({ password: values.password })
        if (updateError) {
          console.error('❌ Eroare la setarea parolei:', updateError)
          setServerError(updateError.message)
          setIsPending(false)
          return
        }

        console.log('✅ Parola setată cu succes')
      } else if (access_token && refresh_token) {
        console.log('🎯 Flow pentru sesiune cu access_token și refresh_token')

        // Pentru alte flow-uri, folosim setSession
        // Setează sesiunea cu tokenurile din URL
        const { error: sessionError } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        })
        if (sessionError) {
          console.error('❌ Eroare la setarea sesiunii:', sessionError)
          setServerError('Nu s-a putut valida sesiunea. Încearcă din nou din email.')
          setIsPending(false)
          return
        }

        console.log('✅ Sesiune setată cu succes')

        // Setează parola nouă
        const { error: updateError } = await supabase.auth.updateUser({ password: values.password })
        if (updateError) {
          console.error('❌ Eroare la setarea parolei:', updateError)
          setServerError(updateError.message)
          setIsPending(false)
          return
        }

        console.log('✅ Parola setată cu succes')
      } else {
        console.error('❌ Nu s-au găsit token-uri valide')
        setServerError('Link-ul de activare este invalid sau a expirat. Încearcă din nou din email.')
        setIsPending(false)
        return
      }

      console.log('🎉 Procesul s-a finalizat cu succes, redirectez...')
      // Redirect la next sau la login
      router.push(next || '/auth/login')
    } catch (error) {
      console.error('💥 Eroare neașteptată:', error)
      setServerError('A apărut o eroare neașteptată. Te rog încearcă din nou.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parolă nouă</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmă parola</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {serverError && <div className="text-red-500 text-sm">{serverError}</div>}
        <SubmitButton className="w-full" isPending={isPending}>
          Setează parola
        </SubmitButton>
      </form>
    </Form>
  )
}
