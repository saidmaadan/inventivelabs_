import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { CampaignsClient } from '@/components/admin/newsletter/campaigns-client';

export const metadata: Metadata = {
  title: 'Newsletter Campaigns',
  description: 'Manage your newsletter campaigns',
};

async function getCampaigns() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      stats: true,
      template: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  return campaigns;
}

async function getTemplates() {
  const templates = await prisma.emailTemplate.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  return templates;
}

export default async function CampaignsPage() {
  const [campaigns, templates] = await Promise.all([getCampaigns(), getTemplates()]);

  return <CampaignsClient initialCampaigns={campaigns} templates={templates} />;
}
