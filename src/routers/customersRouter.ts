import express from 'express';
import * as customerController from '../controllers/customersController';

const router = express.Router();

router.post('/', customerController.createCustomerHandler);
router.patch('/:id', customerController.updateCustomerHandler);
router.delete('/:id', customerController.deleteCustomerHandler);

export default router;
