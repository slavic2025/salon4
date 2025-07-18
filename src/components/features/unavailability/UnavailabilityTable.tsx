// src/components/features/unavailability/UnavailabilityTable.tsx
'use client'

import { Edit, MoreHorizontal, Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  UNAVAILABILITY_CAUSE_LABELS,
  UNAVAILABILITY_COLORS,
  UNAVAILABILITY_ERROR_MESSAGES,
  UNAVAILABILITY_SUCCESS_MESSAGES,
} from '@/core/domains/unavailability/unavailability.constants'
import type { Unavailability } from '@/core/domains/unavailability/unavailability.types'
import { deleteUnavailabilityStylistAction } from '@/features/unavailability/actions'

import { EditUnavailabilityDialog } from './EditUnavailabilityDialog'

type UnavailabilityTableProps = {
  unavailabilities: Unavailability[]
  stylistId: string
}

export function UnavailabilityTable({ unavailabilities, stylistId }: UnavailabilityTableProps) {
  const [editingUnavailability, setEditingUnavailability] = useState<Unavailability | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string) => {
    if (confirm('Ești sigur că vrei să ștergi această indisponibilitate?')) {
      startTransition(async () => {
        try {
          const result = await deleteUnavailabilityStylistAction(id)
          if (result.success) {
            toast.success(UNAVAILABILITY_SUCCESS_MESSAGES.DELETED)
          } else {
            toast.error(result.error || UNAVAILABILITY_ERROR_MESSAGES.DELETE_FAILED)
          }
        } catch (error) {
          console.error('Eroare la ștergerea indisponibilității:', error)
          toast.error(UNAVAILABILITY_ERROR_MESSAGES.DELETE_FAILED)
        }
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatTime = (time: string | null) => {
    if (!time) return null
    return time.substring(0, 5) // Extract HH:MM from HH:MM:SS
  }

  const getCauseColors = (cause: Unavailability['cause']) => {
    return UNAVAILABILITY_COLORS[cause] || UNAVAILABILITY_COLORS.alta_situatie
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Ora</TableHead>
              <TableHead>Cauza</TableHead>
              <TableHead>Descriere</TableHead>
              <TableHead className="w-[70px]">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unavailabilities.map((unavailability) => {
              const colors = getCauseColors(unavailability.cause)

              return (
                <TableRow key={unavailability.id}>
                  <TableCell className="font-medium">{formatDate(unavailability.date)}</TableCell>
                  <TableCell>
                    {unavailability.allDay ? (
                      <Badge variant="secondary">Toată ziua</Badge>
                    ) : (
                      <span className="text-sm">
                        {formatTime(unavailability.startTime)} - {formatTime(unavailability.endTime)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${colors.bg} ${colors.text} ${colors.border} border`}>
                      {UNAVAILABILITY_CAUSE_LABELS[unavailability.cause]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {unavailability.description ? (
                      <span className="text-sm text-muted-foreground">{unavailability.description}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground italic">Fără descriere</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Deschide meniul</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingUnavailability(unavailability)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editează
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(unavailability.id)}
                          disabled={isPending}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Șterge
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {editingUnavailability && (
        <EditUnavailabilityDialog
          unavailability={editingUnavailability}
          isOpen={!!editingUnavailability}
          setIsOpen={(open) => !open && setEditingUnavailability(null)}
          stylistId={stylistId}
        />
      )}
    </>
  )
}
