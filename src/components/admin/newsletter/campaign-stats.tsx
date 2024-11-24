import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CampaignStats } from '@prisma/client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface CampaignStatsDisplayProps {
  stats: CampaignStats;
}

export function CampaignStatsDisplay({ stats }: CampaignStatsDisplayProps) {
  const chartData = [
    { name: 'Sent', value: stats.sent },
    { name: 'Delivered', value: stats.delivered },
    { name: 'Opened', value: stats.opened },
    { name: 'Clicked', value: stats.clicked },
    { name: 'Failed', value: stats.failed },
  ];

  const metrics = [
    {
      title: 'Sent',
      value: stats.sent,
      description: 'Total emails sent',
    },
    {
      title: 'Delivered',
      value: stats.delivered,
      description: 'Successfully delivered',
    },
    {
      title: 'Open Rate',
      value: `${((stats.opened / stats.delivered) * 100).toFixed(1)}%`,
      description: 'Percentage of delivered emails opened',
    },
    {
      title: 'Click Rate',
      value: `${((stats.clicked / stats.opened) * 100).toFixed(1)}%`,
      description: 'Percentage of opened emails clicked',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
      
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
