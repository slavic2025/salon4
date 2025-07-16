// src/components/features/work-schedule/DeleteWorkScheduleMenuItem.tsx
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
import { WORK_SCHEDULE_MESSAGES } from '@/core/domains/work-schedule/workSchedule.constants'
import { deleteStylistOwnScheduleAction } from '@/features/work-schedule/actions'

type DeleteWorkScheduleMenuItemProps = {
  scheduleId: string
  timeInterval: string
}

export function DeleteWorkScheduleMenuItem({ scheduleId, timeInterval }: DeleteWorkScheduleMenuItemProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteStylistOwnScheduleAction({ id: scheduleId })
        if (result.data?.success) {
          toast.success(WORK_SCHEDULE_MESSAGES.SUCCESS.DELETED)
        } else {
          toast.error(WORK_SCHEDULE_MESSAGES.ERROR.DELETE_FAILED)
        }
      } catch (error) {
        console.error('Eroare la ștergerea intervalului:', error)
        toast.error(WORK_SCHEDULE_MESSAGES.ERROR.DELETE_FAILED)
      }
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm">
          <Trash2 className="h-4 w-4" />
          <span>{WORK_SCHEDULE_MESSAGES.UI.DELETE_BUTTON}</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{WORK_SCHEDULE_MESSAGES.UI.DELETE_CONFIRM_TITLE}</AlertDialogTitle>
          <AlertDialogDescription>
            {WORK_SCHEDULE_MESSAGES.UI.DELETE_CONFIRM_DESC}
            <br />
            <strong>Interval: {timeInterval}</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{WORK_SCHEDULE_MESSAGES.UI.CANCEL_BUTTON}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? WORK_SCHEDULE_MESSAGES.UI.LOADING_DELETE : WORK_SCHEDULE_MESSAGES.UI.DELETE_BUTTON}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
