// src/components/features/stylist-appointments/AppointmentStats.tsx

import { Calendar, CheckCircle, Clock, Users } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type AppointmentStatsProps = {
  stats: {
    total: number
    waiting: number
    confirmed: number
    completed: number
    today: number
  }
}

export function AppointmentStats({ stats }: AppointmentStatsProps) {
  const statCards = [
    {
      title: 'Total programări',
      value: stats.total,
      description: 'Toate programările',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'În așteptare',
      value: stats.waiting,
      description: 'Programări care așteaptă acțiuni',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Confirmate',
      value: stats.confirmed,
      description: 'Programări confirmate',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Astăzi',
      value: stats.today,
      description: 'Programări pentru astăzi',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
