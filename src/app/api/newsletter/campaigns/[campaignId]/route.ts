import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

const updateCampaignSchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  content: z.string().min(1),
  templateId: z.string().optional(),
  scheduledAt: z.string().optional(),
  status: z.enum(['DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'FAILED']).optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { campaignId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const campaign = await prisma.campaign.findUnique({
      where: {
        id: params.campaignId,
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

    if (!campaign) {
      return new NextResponse('Campaign not found', { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { campaignId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const body = updateCampaignSchema.parse(json);

    const campaign = await prisma.campaign.update({
      where: {
        id: params.campaignId,
      },
      data: {
        name: body.name,
        subject: body.subject,
        content: body.content,
        templateId: body.templateId,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        status: body.status,
      },
      include: {
        stats: true,
      },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { campaignId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.campaign.delete({
      where: {
        id: params.campaignId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}
