import { Router } from 'express';
import FakeRouter from './fake.route';
class BaseRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.mountRoutes();
    }

    private mountRoutes() {
        this.router.use('/fake', FakeRouter);
    }
}

export = new BaseRouter().router;
