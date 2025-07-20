'use client'

import { Edit, Mail, MoreHorizontal, Phone } from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Stylist } from '@/core/domains/stylists/stylist.types'

import { DeleteStylistMenuItem } from './DeleteStylistMenuItem'
import { EditStylistDialog } from './EditStylistDialog'

type StylistCardProps = {
  stylist: Stylist
}

export function StylistCard({ stylist }: StylistCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  return (
    <>
      <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={stylist.profilePicture ?? undefined} alt={stylist.fullName} />
                <AvatarFallback className="text-lg font-semibold">
                  {stylist.fullName?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{stylist.fullName}</h3>
                <Badge variant={stylist.isActive ? 'outline' : 'destructive'} className="mt-1">
                  {stylist.isActive ? 'Activ' : 'Inactiv'}
                </Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Opțiuni stilist</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acțiuni</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editează
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-destructive">
                  <DeleteStylistMenuItem stylistId={stylist.id} stylistName={stylist.fullName} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {stylist.description && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{stylist.description}</p>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="truncate">{stylist.email}</span>
            </div>
            {stylist.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{stylist.phone}</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${stylist.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-xs text-muted-foreground">
                {stylist.isActive ? 'Disponibil pentru programări' : 'Indisponibil'}
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>

      <EditStylistDialog stylist={stylist} isOpen={isEditDialogOpen} setIsOpen={setIsEditDialogOpen} />
    </>
  )
}
