// src/components/features/work-schedule/EditWorkScheduleDialog.tsx
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { WORK_SCHEDULE_MESSAGES } from '@/core/domains/work-schedule/workSchedule.constants'
import type { WorkSchedule } from '@/core/domains/work-schedule/workSchedule.types'
import { updateStylistOwnScheduleAction } from '@/features/work-schedule/actions'
import { useActionForm } from '@/hooks/useActionForm'

import { WorkScheduleForm } from './WorkScheduleForm'

type EditWorkScheduleDialogProps = {
  interval: WorkSchedule
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  stylistId: string
}

export function EditWorkScheduleDialog({ interval, isOpen, setIsOpen, stylistId }: EditWorkScheduleDialogProps) {
  const { formSubmit, isPending } = useActionForm({
    action: (values) =>
      updateStylistOwnScheduleAction({
        id: interval.id,
        stylistId,
        dayOfWeek: values.dayOfWeek,
        startTime: values.startTime,
        endTime: values.endTime,
      }),
    onSuccess: () => setIsOpen(false),
    toastMessages: {
      loading: WORK_SCHEDULE_MESSAGES.UI.LOADING_UPDATE,
      success: WORK_SCHEDULE_MESSAGES.SUCCESS.UPDATED,
      error: WORK_SCHEDULE_MESSAGES.ERROR.UPDATE_FAILED,
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{WORK_SCHEDULE_MESSAGES.UI.EDIT_TITLE}</DialogTitle>
        </DialogHeader>
        <WorkScheduleForm
          defaultValues={{
            dayOfWeek: interval.dayOfWeek,
            startTime: interval.startTime,
            endTime: interval.endTime,
          }}
          onSubmit={formSubmit}
          isPending={isPending}
          submitButtonText={WORK_SCHEDULE_MESSAGES.UI.SAVE_BUTTON}
        />
      </DialogContent>
    </Dialog>
  )
}
