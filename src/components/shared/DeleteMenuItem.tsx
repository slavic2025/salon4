// src/components/shared/DeleteMenuItem.tsx
'use client'

import { Trash } from 'lucide-react'
import { ReactNode, useTransition } from 'react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

export type DeleteMenuItemMessages = {
  confirmTitle: string
  confirmDescription: string | ReactNode
  success: string
  validationError?: string
  genericError?: string
}

export type DeleteMenuItemProps = {
  id: string
  name: string
  onDelete: (id: string) => Promise<any>
  messages: DeleteMenuItemMessages
  icon?: ReactNode
  disabled?: boolean
}

export function DeleteMenuItem({ id, name, onDelete, messages, icon, disabled }: DeleteMenuItemProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await onDelete(id)
        if (result?.data?.success || result?.success) {
          toast.success(messages.success)
        } else if (result?.validationErrors) {
          toast.error(result.validationErrors.id?.[0] || messages.validationError || 'Eroare de validare la ștergere.')
        } else if (result?.serverError) {
          toast.error(result.serverError)
        } else {
          toast.error(messages.genericError || 'A apărut o eroare la ștergere.')
        }
      } catch (e: any) {
        toast.error(messages.genericError || 'A apărut o eroare la ștergere.')
      }
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="text-red-600 focus:text-red-600"
          disabled={disabled || isPending}
        >
          {icon || <Trash className="mr-2 h-4 w-4" />}
          <span>Șterge</span>
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{messages.confirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>{messages.confirmDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anulează</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isPending ? 'Se șterge...' : 'Da, șterge'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
