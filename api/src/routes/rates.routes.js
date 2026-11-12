import { Router } from 'express';
import { previewRate } from '../controllers/rates.controller.js';
export const ratesRouter = Router();
ratesRouter.get('/', previewRate);
