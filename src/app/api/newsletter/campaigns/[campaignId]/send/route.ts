import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { sendNewsletter } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: { campaignId: string } }
) {
  try {
    // Validate campaignId
    if (!params.campaignId) {
      console.error('Missing campaignId in request params');
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    // Check authentication
    const session = await auth();
    if (!session?.user?.email) {
      console.error('Unauthorized attempt to send campaign');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch campaign
    const campaign = await prisma.campaign.findUnique({
      where: { id: params.campaignId },
      include: {
        stats: true,
      },
    });

    if (!campaign) {
      console.error(`Campaign not found: ${params.campaignId}`);
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Validate campaign status
    if (campaign.status !== 'DRAFT') {
      console.error(`Invalid campaign status: ${campaign.status}`);
      return NextResponse.json(
        { error: `Campaign cannot be sent because it is in ${campaign.status} status` },
        { status: 400 }
      );
    }

    // Get active subscribers
    const subscribers = await prisma.newsletter.findMany({
      where: {
        active: true,
        status: 'ACTIVE',
      },
    });

    if (subscribers.length === 0) {
      console.error('No active subscribers found');
      return NextResponse.json(
        { error: 'No active subscribers found' },
        { status: 400 }
      );
    }

    // Update campaign status to SENDING
    await prisma.campaign.update({
      where: { id: params.campaignId },
      data: { status: 'SENDING' },
    });

    // Send the newsletter
    try {
      const result = await sendNewsletter({
        to: subscribers.map(s => s.email),
        subject: campaign.subject,
        html: campaign.content,
        campaignId: campaign.id,
      });

      // Update campaign stats
      await prisma.campaignStats.update({
        where: { campaignId: campaign.id },
        data: {
          sent: result.total,
          delivered: result.sent,
          failed: result.failed,
        },
      });

      // Update campaign status
      await prisma.campaign.update({
        where: { id: params.campaignId },
        data: { 
          status: result.failed === result.total ? 'FAILED' : 'SENT',
          sentAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        stats: {
          total: result.total,
          sent: result.sent,
          failed: result.failed,
        },
      });
    } catch (error) {
      console.error('Error sending newsletter:', error);
      
      // If sending fails, update campaign status to FAILED
      await prisma.campaign.update({
        where: { id: params.campaignId },
        data: { status: 'FAILED' },
      });

      return NextResponse.json(
        { error: 'Failed to send newsletter' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in campaign send route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
