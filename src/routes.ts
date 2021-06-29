import { Router } from 'express';
import UserController from './controllers/UserControllerMySQL';

const routes = Router();

// CONTROLLERS
const userController = new UserController();

// ROUTES
routes.post('/user', userController.insert);
routes.get('/user', userController.select);
routes.put('/user/:id', userController.update);
routes.delete('/user/:id', userController.delete);

export default routes;