import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { formValidationSchema } from 'validationSchema/forms';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.form
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getFormById();
    case 'PUT':
      return updateFormById();
    case 'DELETE':
      return deleteFormById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getFormById() {
    const data = await prisma.form.findFirst(convertQueryToPrismaUtil(req.query, 'form'));
    return res.status(200).json(data);
  }

  async function updateFormById() {
    await formValidationSchema.validate(req.body);
    const data = await prisma.form.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteFormById() {
    const data = await prisma.form.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
