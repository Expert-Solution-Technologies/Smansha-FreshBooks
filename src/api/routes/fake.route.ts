// Module imports
import { Request, Response, Router } from 'express';
import { GeneralHttpExceptions } from 'src/custom-exceptions/general-exceptions.constants';
import { MessageConstants } from '@constants/response.constants';
import { FakeService } from '../services/fake.service';
import { SmanshaAIException } from 'src/custom-exceptions';
import { createValidator } from 'express-joi-validation';
import { FakeValidations } from 'src/schema-validations/schemas/entity.validation';
const fakeService = new FakeService();
const validator = createValidator({ passError: true });
class FakeEntityRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.mountRoutes();
    }

    private mountRoutes() {
        this.router.get('/', this.getAllRecords);
        this.router.post('/', [validator.body(FakeValidations.SaveEntity)], this.createRecord);
        this.router.delete('/', this.deleteRecord);
        this.router.put('/', this.updateRecord);
    }

    async getAllRecords(req: Request, res: Response) {
        const results = await fakeService.getAllRecords();
        if (results) {
            return res.json({ status: true, message: MessageConstants.general.dataFetch, data: results });
        } else {
            throw new SmanshaAIException(GeneralHttpExceptions.EntityNotFoundException, MessageConstants.general.recordNotFound);
        }
    }

    async updateRecord(req: Request, res: Response) {
        const results = await fakeService.updateRecord(req.body);
        if (results) {
            return res.json({ status: true, message: MessageConstants.general.dataFetch, data: results });
        } else {
            throw new SmanshaAIException(GeneralHttpExceptions.EntityNotFoundException, MessageConstants.general.recordNotFound);
        }
    }

    async deleteRecord(req: Request, res: Response) {
        const results = await fakeService.deleteRecord(req.body.entityId);
        if (results) {
            return res.json({ status: true, message: MessageConstants.general.recordDeleted, data: results });
        } else {
            throw new SmanshaAIException(GeneralHttpExceptions.EntityNotFoundException, MessageConstants.general.recordNotFound);
        }
    }

    async createRecord(req: Request, res: Response) {
        const results = await fakeService.createRecord(req.body);
        if (results) {
            return res.json({ status: true, message: MessageConstants.general.saved, data: results });
        } else {
            throw new SmanshaAIException(GeneralHttpExceptions.EntityNotFoundException, MessageConstants.general.somethingWrong);
        }
    }
}

export = new FakeEntityRouter().router;
