import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { formValidationSchema } from 'validationSchema/forms';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getForms();
    case 'POST':
      return createForm();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getForms() {
    const data = await prisma.form
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'form'));
    return res.status(200).json(data);
  }

  async function createForm() {
    await formValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.submission?.length > 0) {
      const create_submission = body.submission;
      body.submission = {
        create: create_submission,
      };
    } else {
      delete body.submission;
    }
    const data = await prisma.form.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
