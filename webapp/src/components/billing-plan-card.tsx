'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'

interface BillingPlanCardProps {
  planType: string // e.g. "Premium", "VIP"
  price: string    // e.g. "$5", "$10"
  days: number     // e.g. 7, 15
  selected?: boolean
  onClick?: () => void
  disabled?: boolean
}

export function BillingPlanCard({
  planType,
  price,
  days,
  selected,
  disabled,
  onClick,
}: BillingPlanCardProps) {
  return (
    <Card
      onClick={onClick}
      className={`cursor-pointer border hover:shadow transition-colors text-center ${
        selected ? 'border-blue-500 ring-1 ring-blue-500' : ''
      }`}
    >
      {/* 1) Plan Type in the Header */}
      <CardHeader className='py-5 pb-3'>
        <CardTitle className="text-lg font-medium">{planType}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-sm pb-5">
        {/* 2) Price (emphasized) */}
        <p className="text-3xl font-bold text-orange-600">{price}</p>

        {/* 3) One-time membership for X days */}
        <p>One-time membership for {days} days</p>

        {/* 4) For Commercial Use (bold) */}
        <p className="font-bold">For Commercial Use</p>
      </CardContent>
    </Card>
  )
}
