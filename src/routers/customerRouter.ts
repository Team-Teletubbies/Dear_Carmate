import express from 'express';
import { asyncHandler } from '../lib/async-handler';
import * as customerController from '../controllers/customerController';
const router = express.Router();

router.post('/', asyncHandler(customerController.createCustomerHandler));
router.patch('/:id', asyncHandler(customerController.updateCustomerHandler));
router.delete('/:id', asyncHandler(customerController.deleteCustomerHandler));
router.get('/', asyncHandler(customerController.getCustomersHandler));

export default router;
