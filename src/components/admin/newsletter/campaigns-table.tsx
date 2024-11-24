'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Campaign, EmailTemplate } from '@prisma/client';
import { CampaignActions } from './campaign-actions';

interface CampaignsTableProps {
  campaigns: (Campaign & {
    stats: {
      sent: number;
      delivered: number;
      opened: number;
      clicked: number;
      failed: number;
    } | null;
    template: {
      id: string;
      name: string;
    } | null;
  })[];
  templates: EmailTemplate[];
}

export function CampaignsTable({ campaigns, templates }: CampaignsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Stats</TableHead>
            <TableHead>Scheduled</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell className="font-medium">{campaign.name}</TableCell>
              <TableCell>{campaign.subject}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(campaign.status)}>
                  {campaign.status}
                </Badge>
              </TableCell>
              <TableCell>
                {campaign.stats && (
                  <div className="text-sm">
                    <div>Sent: {campaign.stats.sent}</div>
                    <div>Opened: {campaign.stats.opened}</div>
                    <div>Clicked: {campaign.stats.clicked}</div>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {campaign.scheduledAt ? formatDate(campaign.scheduledAt) : '-'}
              </TableCell>
              <TableCell>{formatDate(campaign.createdAt)}</TableCell>
              <TableCell className="text-right">
                <CampaignActions campaign={campaign} templates={templates} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'DRAFT':
      return 'secondary';
    case 'SCHEDULED':
      return 'warning';
    case 'SENDING':
      return 'default';
    case 'SENT':
      return 'success';
    case 'FAILED':
      return 'destructive';
    default:
      return 'default';
  }
}
