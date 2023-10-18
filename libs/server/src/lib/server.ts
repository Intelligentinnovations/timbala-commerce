import { expireItem, getItem } from '@backend-template/cache';
import { UserData } from '@backend-template/types';
import express, { Application, Router } from 'express';
import { DateTime } from 'luxon';

import {
  authorizer,
  errorHandler,
  postRequestHandler,
  preRequestHandler,
  reqLogger,
  Res,
  SecurityBuilder,
} from '../utils';

export const server = (
  router: Router,
  security: SecurityBuilder,
  baseUrl?: string
): Application => {
  const app = express();

  app.use(
    express.raw({ limit: '5mb', inflate: true, type: 'application/json' }),
    (req, res, next) => {
      if (Buffer.isBuffer(req.body)) {
        req.rawBody = req.body;
        try {
          req.body = JSON.parse(req.body.toString());
        } catch (e) {
          console.error('server error: ', e);
        }
      }
      return next();
    }
  );

  app.use(express.urlencoded({ extended: false, limit: '5mb' }));
  app.use(reqLogger);

  app.use(async (req, res, next) => {
    const {
      isAuthorized,
      data: { user, token },
    } = await authorizer<UserData>(req, security, baseUrl);

    if (!isAuthorized)
      return res.status(401).send({ success: false, message: 'unauthorized' });

    req.user = user;
    req.token = token;

    return next();
  });

  router.get('/health', (req, res) => {
    res.status(200).send({ success: true, message: 'successful' });
  });

  app.use(preRequestHandler);

  app.use(`/${baseUrl ?? ''}`, router);

  app.use(postRequestHandler);

  app.use(errorHandler);

  return app;
};
