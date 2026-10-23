import { categoryService } from './category.service';
import { brandService } from './brand.service';
import { productService } from './product.service';
import { variantService } from './variant.service';
import { warehouseService } from './warehouse.service';
import { receivingSlipService } from './receiving-slip.service';
import { inventoryMovementService } from './inventory-movement.service';
import { authorizationService } from './authorization.service';
import { userService } from './user.service';
import { invitationService } from './invitation.service';
import { authenticationService } from './authentication.service';
import { emailService } from './email.service';
import { sessionService } from './session.service';
import { googleOAuthService } from './google-oauth.service';

export const categoryServicePublic = {
  findAll: categoryService.findAll,
  findAllDefault: categoryService.findAllDefault,
  findById: categoryService.findById,
  create: categoryService.create,
  update: categoryService.update,
  softDelete: categoryService.softDelete,
};

export const categoryServicePrivate = {
  hardDelete: categoryService.hardDelete,
};

export const brandServicePublic = {
  findAll: brandService.findAll,
  findById: brandService.findById,
  create: brandService.create,
  update: brandService.update,
  delete: brandService.delete,
};

export const productServicePublic = {
  findAll: productService.findAll,
  findAllDefault: productService.findAllDefault,
  findById: productService.findById,
  findBySku: productService.findBySku,
  create: productService.create,
  update: productService.update,
  softDelete: productService.softDelete,
};

export const productServicePrivate = {
  hardDelete: productService.hardDelete,
};

export const variantServicePublic = {
  findAll: variantService.findAll,
  findAllDefault: variantService.findAllDefault,
  findById: variantService.findById,
  findBySku: variantService.findBySku,
  create: variantService.create,
  update: variantService.update,
  softDelete: variantService.softDelete,
};

export const variantServicePrivate = {
  hardDelete: variantService.hardDelete,
};

export const warehouseServicePublic = {
  findAll: warehouseService.findAll,
  findAllDefault: warehouseService.findAllDefault,
  findById: warehouseService.findById,
  create: warehouseService.create,
  update: warehouseService.update,
};

export const receivingSlipServicePublic = {
  findAll: receivingSlipService.findAll,
  findAllDefault: receivingSlipService.findAllDefault,
  findById: receivingSlipService.findById,
  findBySlipNumber: receivingSlipService.findBySlipNumber,
  create: receivingSlipService.create,
  update: receivingSlipService.update,
  confirm: receivingSlipService.confirm,
};

export const inventoryMovementServicePublic = {
  findAll: inventoryMovementService.findAll,
  findAllDefault: inventoryMovementService.findAllDefault,
  findById: inventoryMovementService.findById,
  findBySource: inventoryMovementService.findBySource,
};

export const inventoryMovementServicePrivate = {
  create: inventoryMovementService.create,
  bulkCreate: inventoryMovementService.bulkCreate,
  delete: inventoryMovementService.delete,
};

export const authorizationServicePublic = {
  resolvePermissions: authorizationService.resolvePermissions,
  hasPermission: authorizationService.hasPermission,
};

export const userServicePublic = {
  create: userService.create,
  findById: userService.findProfileForActor,
  updateOwn: userService.updateOwnProfile,
  updateByAdmin: userService.updateUserByAdmin,
  deleteByAdmin: userService.deleteByAdmin,
  deleteBySuperAdmin: userService.deleteBySuperAdmin,
};

export const userServicePrivate = {
  findById: userService.findById,
  findByExternalId: userService.findByExternalId,
  findByEmail: userService.findByEmail,
};

export const invitationServicePublic = {
  createInvitation: invitationService.createInvitation,
  previewInvitation: invitationService.previewInvitation,
};

export const invitationServicePrivate = {
  findValidByRawToken: invitationService.findValidByRawToken,
  consumeInvitation: invitationService.consumeInvitation,
};

export const authenticationServicePublic = {
  register: authenticationService.register,
  registerWithInvitation: authenticationService.registerWithInvitation,
  login: authenticationService.login,
};

export const emailServicePublic = {
  sendEmail: emailService.sendEmail,
  isConfigured: emailService.isConfigured,
};

export const sessionServicePublic = {
  createLoginSession: sessionService.createLoginSession,
  getSessionUser: sessionService.getSessionUser,
  isAuthenticated: sessionService.isAuthenticated,
  destroySession: sessionService.destroySession,
};

export const googleOAuthServicePublic = {
  buildAuthorizationUrl: googleOAuthService.buildAuthorizationUrl,
  exchangeCodeForTokens: googleOAuthService.exchangeCodeForTokens,
  fetchUserProfile: googleOAuthService.fetchUserProfile,
};