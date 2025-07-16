// src/components/features/work-schedule/AddWorkScheduleDialog.tsx
'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { WORK_SCHEDULE_MESSAGES } from '@/core/domains/work-schedule/workSchedule.constants'
import { createStylistOwnScheduleAction } from '@/features/work-schedule/actions'
import { useActionForm } from '@/hooks/useActionForm'

import { WorkScheduleForm } from './WorkScheduleForm'

type AddWorkScheduleDialogProps = {
  stylistId: string
}

export function AddWorkScheduleDialog({ stylistId }: AddWorkScheduleDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { formSubmit, isPending } = useActionForm({
    action: async (values) => {
      return createStylistOwnScheduleAction({
        stylistId,
        dayOfWeek: values.dayOfWeek,
        startTime: values.startTime,
        endTime: values.endTime,
      })
    },
    onSuccess: () => {
      setIsOpen(false)
    },
    toastMessages: {
      loading: WORK_SCHEDULE_MESSAGES.UI.LOADING_ADD,
      success: WORK_SCHEDULE_MESSAGES.SUCCESS.CREATED,
      error: WORK_SCHEDULE_MESSAGES.ERROR.CREATE_FAILED,
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {WORK_SCHEDULE_MESSAGES.UI.ADD_BUTTON}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{WORK_SCHEDULE_MESSAGES.UI.ADD_TITLE}</DialogTitle>
          <DialogDescription>Configurează un nou interval de lucru pentru o zi a săptămânii.</DialogDescription>
        </DialogHeader>
        <WorkScheduleForm
          onSubmit={formSubmit}
          isPending={isPending}
          submitButtonText={WORK_SCHEDULE_MESSAGES.UI.ADD_BUTTON}
        />
      </DialogContent>
    </Dialog>
  )
}
