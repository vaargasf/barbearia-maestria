import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '@/components/ui/Card'
import { formatPrice } from '@/constants/booking'
import { cn } from '@/lib/utils'
import { TrendingDown, TrendingUp } from 'lucide-react'

function ChangeBadge({ value, label }) {
  const positive = value >= 0
  const Icon = positive ? TrendingUp : TrendingDown

  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium',
          positive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
        )}
      >
        <Icon size={14} />
        {positive ? '+' : ''}
        {value}%
      </span>
      <span className="text-white/60">{label}</span>
    </div>
  )
}

function ChartTooltip({ active, payload, label, valueFormatter }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-white/10 bg-card px-3 py-2 text-sm shadow-lg">
      <p className="font-medium text-white mb-1 capitalize">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name}: {valueFormatter(entry.value)}
        </p>
      ))}
    </div>
  )
}

export function BarberDashboardCharts({ stats }) {
  const { months, summary } = stats

  return (
    <div className="space-y-6 mb-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <p className="text-white/60 text-sm mb-1">Agendamentos este mês</p>
          <p className="text-3xl font-bold text-maestria-accent">{summary.appointmentsThisMonth}</p>
          <ChangeBadge value={summary.appointmentsChange} label="vs mês anterior" />
        </Card>
        <Card>
          <p className="text-white/60 text-sm mb-1">Receita este mês</p>
          <p className="text-3xl font-bold text-maestria-accent">
            {formatPrice(summary.revenueThisMonth)}
          </p>
          <ChangeBadge value={summary.revenueChange} label="vs mês anterior" />
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-maestria-accent font-medium mb-4">Agendamentos por mês</h2>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={months} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
                <Tooltip
                  content={({ active, payload, label }) => (
                    <ChartTooltip
                      active={active}
                      payload={payload}
                      label={label}
                      valueFormatter={(v) => `${v} agendamento(s)`}
                    />
                  )}
                />
                <Bar dataKey="appointments" name="Agendamentos" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="text-maestria-accent font-medium mb-4">Receita mensal</h2>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={months} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
                <YAxis
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                  tickFormatter={(v) => `R$${v}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => (
                    <ChartTooltip
                      active={active}
                      payload={payload}
                      label={label}
                      valueFormatter={(v) => formatPrice(v)}
                    />
                  )}
                />
                <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Receita"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-white/50 mt-3">
            Receita calculada com base em agendamentos finalizados.
          </p>
        </Card>
      </div>
    </div>
  )
}
