// TODO: Importă acțiunea de setare a parolei și componentele UI necesare
// import { setPasswordAction } from '@/features/auth/set-password-action'
import { SetPasswordForm } from '@/components/features/auth/SetPasswordForm'
import { createClient } from '@/lib/supabase/server'

export default async function ConfirmPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log('🎨 ConfirmPage - Utilizator autentificat:', !!user)
  console.log('🎨 ConfirmPage - Metadata utilizator:', user?.user_metadata)

  // Dacă utilizatorul este autentificat prin invitație, îl lăsăm să-și seteze parola
  if (user && user.user_metadata?.email_verified) {
    console.log('✅ Utilizator autentificat prin invitație, afișez formularul de setare parolă')
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Finalizează înregistrarea</h1>
      <p className="mb-6">Setează o parolă pentru a-ți activa contul de stilist.</p>
      <SetPasswordForm />
    </div>
  )
}
