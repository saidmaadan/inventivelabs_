'use client';

import { Campaign, EmailTemplate } from '@prisma/client';
import { CampaignsTable } from './campaigns-table';
import { CampaignForm } from './campaign-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface CampaignsClientProps {
  initialCampaigns: (Campaign & {
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

export function CampaignsClient({
  initialCampaigns,
  templates,
}: CampaignsClientProps) {
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreate = async (data: any) => {
    try {
      const response = await fetch('/api/newsletter/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }

      toast.success('Campaign created successfully');
      router.refresh();
      setIsCreateDialogOpen(false);
    } catch (error) {
      toast.error('Failed to create campaign');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Campaigns</h2>
          <p className="text-muted-foreground">
            Create and manage your newsletter campaigns
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Campaign</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Campaign</DialogTitle>
            </DialogHeader>
            <CampaignForm templates={templates} onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <div className="rounded-md border">
          <CampaignsTable
            campaigns={initialCampaigns}
            templates={templates}
          />
        </div>
      </div>
    </div>
  );
}
