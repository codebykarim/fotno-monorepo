import { AuthUser, StorageGuardDecision } from '../interfaces/index'

declare global {
  namespace Express {
    interface Request {
      user: AuthUser
      storageGuard?: StorageGuardDecision
    }
  }
}

export {}
