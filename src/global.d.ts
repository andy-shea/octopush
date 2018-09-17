import {Injector} from '@angular/core';
import User from './domain/user/User';

declare global {
  namespace Express {
    interface Request {
      injector: Injector;
      user?: User;
    }
  }
}
