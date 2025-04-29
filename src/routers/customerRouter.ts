import express from 'express';
import { asyncHandler } from '../lib/async-handler';
import upload from '../middlewares/uploadMiddleware';
import { verifyAccessToken } from '../middlewares/verifyAccessToken';
import * as customerController from '../controllers/customerController';

const router = express.Router();

router.post('/', verifyAccessToken, asyncHandler(customerController.createCustomerHandler));
router.patch('/:id', verifyAccessToken, asyncHandler(customerController.updateCustomerHandler));
router.delete('/:id', verifyAccessToken, asyncHandler(customerController.deleteCustomerHandler));
router.get('/', verifyAccessToken, asyncHandler(customerController.getCustomersHandler));
router.get('/search', verifyAccessToken, asyncHandler(customerController.getCustomerDetailHandler));
router.post(
  '/upload',
  verifyAccessToken,
  upload.single('file'),
  asyncHandler(customerController.bulkUploadCustomersHandler),
);

export default router;
