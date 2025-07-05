// src/components/features/stylists/DeleteStylistMenuItem.tsx
'use client'

import { Trash } from 'lucide-react'
import { useTransition } from 'react'
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
import { STYLIST_MESSAGES } from '@/core/domains/stylists/stylist.constants'
import { deleteStylistAction } from '@/features/stylists/actions'

type DeleteStylistMenuItemProps = {
  stylistId: string
  stylistName: string
}

export function DeleteStylistMenuItem({ stylistId, stylistName }: DeleteStylistMenuItemProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteStylistAction({ id: stylistId })
      if (result?.serverError) {
        toast.error(result.serverError)
      } else {
        toast.success(STYLIST_MESSAGES.SERVER.DELETE_SUCCESS)
      }
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {/* Folosim onSelect pentru a preveni închiderea dropdown-ului */}
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          <span>Șterge</span>
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ești absolut sigur?</AlertDialogTitle>
          <AlertDialogDescription>
            Această acțiune nu poate fi anulată. Contul și toate datele asociate stilistului{' '}
            <strong>{stylistName}</strong> vor fi șterse permanent.
          </AlertDialogDescription>
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
