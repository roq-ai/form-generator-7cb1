import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { submissionValidationSchema } from 'validationSchema/submissions';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.submission
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getSubmissionById();
    case 'PUT':
      return updateSubmissionById();
    case 'DELETE':
      return deleteSubmissionById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSubmissionById() {
    const data = await prisma.submission.findFirst(convertQueryToPrismaUtil(req.query, 'submission'));
    return res.status(200).json(data);
  }

  async function updateSubmissionById() {
    await submissionValidationSchema.validate(req.body);
    const data = await prisma.submission.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteSubmissionById() {
    const data = await prisma.submission.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
