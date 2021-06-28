import { Router } from 'express';
import UserController from './controllers/UserControllerMySQL';

const routes = Router();

// CONTROLLERS
const userController = new UserController();

// ROUTES
routes.get('/user', userController.select);
routes.put('/user', userController.insert);
routes.delete('/user/:id', userController.delete);

export default routes;