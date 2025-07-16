// src/components/features/stylist-services/StylistOwnServicesPageContent.tsx
'use client'

import { EmptyState } from '@/components/shared/EmptyState'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { STYLIST_SERVICE_LINK_MESSAGES } from '@/core/domains/stylist-services/stylist-service.constants'
import type { StylistServiceLinkWithService } from '@/core/domains/stylist-services/stylist-service.types'

import { AddStylistOwnServiceDialog } from './AddStylistOwnServiceDialog'
import { StylistOwnServicesTable } from './StylistOwnServicesTable'

type StylistOwnServicesPageContentProps = {
  services: StylistServiceLinkWithService[]
  stylistId: string
}

export function StylistOwnServicesPageContent({ services, stylistId }: StylistOwnServicesPageContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{STYLIST_SERVICE_LINK_MESSAGES.UI.PAGE_TITLE}</h1>
          <p className="text-muted-foreground">{STYLIST_SERVICE_LINK_MESSAGES.UI.PAGE_DESCRIPTION}</p>
        </div>
        <AddStylistOwnServiceDialog stylistId={stylistId} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{STYLIST_SERVICE_LINK_MESSAGES.UI.SERVICES_LIST_TITLE}</CardTitle>
          <CardDescription>{STYLIST_SERVICE_LINK_MESSAGES.UI.SERVICES_COUNT(services.length)}</CardDescription>
        </CardHeader>
        <CardContent>
          {services.length > 0 ? (
            <StylistOwnServicesTable services={services} stylistId={stylistId} />
          ) : (
            <EmptyState
              title={STYLIST_SERVICE_LINK_MESSAGES.UI.EMPTY_STATE_TITLE}
              description={STYLIST_SERVICE_LINK_MESSAGES.UI.EMPTY_STATE_DESCRIPTION}
              actions={<AddStylistOwnServiceDialog stylistId={stylistId} />}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
