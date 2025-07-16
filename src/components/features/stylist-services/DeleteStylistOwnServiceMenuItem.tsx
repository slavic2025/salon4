// src/components/features/stylist-services/DeleteStylistOwnServiceMenuItem.tsx
'use client'

import { Trash2 } from 'lucide-react'
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
import { STYLIST_SERVICE_LINK_MESSAGES } from '@/core/domains/stylist-services/stylist-service.constants'
import { deleteStylistOwnServiceAction } from '@/features/stylist-services/actions'

type DeleteStylistOwnServiceMenuItemProps = {
  stylistId: string
  serviceId: string
  serviceName: string
}

export function DeleteStylistOwnServiceMenuItem({
  stylistId,
  serviceId,
  serviceName,
}: DeleteStylistOwnServiceMenuItemProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteStylistOwnServiceAction({ stylistId, serviceId })
        if (result.data?.success) {
          toast.success(STYLIST_SERVICE_LINK_MESSAGES.SUCCESS.REMOVED)
        } else {
          toast.error(STYLIST_SERVICE_LINK_MESSAGES.ERROR.GENERIC)
        }
      } catch (error) {
        console.error('Eroare la ștergerea serviciului:', error)
        toast.error(STYLIST_SERVICE_LINK_MESSAGES.ERROR.GENERIC)
      }
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm">
          <Trash2 className="h-4 w-4" />
          <span>{STYLIST_SERVICE_LINK_MESSAGES.UI.DELETE_BUTTON}</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{STYLIST_SERVICE_LINK_MESSAGES.UI.DELETE_CONFIRM_TITLE}</AlertDialogTitle>
          <AlertDialogDescription>
            {STYLIST_SERVICE_LINK_MESSAGES.UI.DELETE_CONFIRM_DESC(serviceName)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{STYLIST_SERVICE_LINK_MESSAGES.UI.CANCEL_BUTTON}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending
              ? STYLIST_SERVICE_LINK_MESSAGES.UI.LOADING_DELETE
              : STYLIST_SERVICE_LINK_MESSAGES.UI.DELETE_BUTTON}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
