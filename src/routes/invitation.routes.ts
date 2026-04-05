import { Router } from 'express';
import { PERMISSIONS } from '../constants/permissions';
import { invitationController } from '../controllers';
import { requireAuth, requirePermission } from '../middlewares';

const router = Router();

// GET /invitations/preview?token=...
router.get('/preview', invitationController.preview);

// POST /invitations
router.post(
  '/',
  requireAuth(),
  requirePermission(PERMISSIONS.USER_CREATE),
  invitationController.create
);

export const invitationRoutes = router;
