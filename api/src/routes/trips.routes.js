import { Router } from 'express';
import { listTrips, getTrip, createTrip, updateTrip, deleteTrip } from '../controllers/trips.controller.js';
export const tripsRouter = Router();
tripsRouter.get('/', listTrips);
tripsRouter.get('/:id', getTrip);
tripsRouter.post('/', createTrip);
tripsRouter.patch('/:id', updateTrip);
tripsRouter.delete('/:id', deleteTrip);
