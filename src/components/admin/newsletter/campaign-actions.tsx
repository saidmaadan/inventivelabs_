'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Campaign, EmailTemplate } from '@prisma/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { CampaignForm } from './campaign-form';

interface CampaignActionsProps {
  campaign: Campaign;
  templates: EmailTemplate[];
}

export function CampaignActions({ campaign, templates }: CampaignActionsProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/newsletter/campaigns/${campaign.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete campaign');
      }

      toast.success('Campaign deleted successfully');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete campaign');
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      const response = await fetch(`/api/newsletter/campaigns/${campaign.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update campaign');
      }

      toast.success('Campaign updated successfully');
      router.refresh();
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update campaign');
    }
  };

  const handleSend = async () => {
    try {
      setIsSending(true);
      const url = new URL(`/api/newsletter/campaigns/${campaign.id}/send`, window.location.origin);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send campaign');
      }

      toast.success('Campaign is being sent');
      router.refresh();
    } catch (error: any) {
      console.error('Error sending campaign:', error);
      toast.error(error.message || 'Failed to send campaign');
    } finally {
      setIsSending(false);
      setIsSendDialogOpen(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
          </DialogHeader>
          <CampaignForm
            campaign={campaign}
            templates={templates}
            onSubmit={handleUpdate}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          Delete
        </Button>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              campaign and all its statistics.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {campaign.status === 'DRAFT' && (
        <AlertDialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
          <Button
            size="sm"
            onClick={() => setIsSendDialogOpen(true)}
            disabled={isSending}
          >
            {isSending ? 'Sending...' : 'Send Now'}
          </Button>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Send Campaign</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to send this campaign? This will send emails
                to all active subscribers and cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSend} disabled={isSending}>
                {isSending ? 'Sending...' : 'Send Campaign'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
