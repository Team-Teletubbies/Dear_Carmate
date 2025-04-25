import express from 'express';
import { asyncHandler } from '../lib/async-handler';
import upload from '../middlewares/uploadMiddleware';
import { verifyAccessToken } from '../middlewares/verifyAccessToken';
import * as customerController from '../controllers/customerController';

const router = express.Router();

router.post('/', asyncHandler(customerController.createCustomerHandler));
router.patch('/:id', asyncHandler(customerController.updateCustomerHandler));
router.delete('/:id', asyncHandler(customerController.deleteCustomerHandler));
router.get('/', asyncHandler(customerController.getCustomersHandler));
router.post(
  '/upload',
  verifyAccessToken,
  upload.single('file'),
  asyncHandler(customerController.bulkUploadCustomersHandler),
);

export default router;
