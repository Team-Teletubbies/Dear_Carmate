import express from 'express';
import { asyncHandler } from '../lib/async-handler';
import upload from '../middlewares/uploadMiddleware';
import { verifyAccessToken } from '../middlewares/verifyAccessToken';
import * as customerController from '../controllers/customerController';

const router = express.Router();

router.post('/', verifyAccessToken, asyncHandler(customerController.createCustomer));
router.patch('/:id', verifyAccessToken, asyncHandler(customerController.updateCustomer));
router.delete('/:id', verifyAccessToken, asyncHandler(customerController.deleteCustomer));
router.get('/', verifyAccessToken, asyncHandler(customerController.getCustomer));
router.get('/search', verifyAccessToken, asyncHandler(customerController.getCustomerDetail));
router.post(
  '/upload',
  verifyAccessToken,
  upload.single('file'),
  asyncHandler(customerController.bulkUploadCustomer),
);

export default router;
