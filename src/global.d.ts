import {Injector} from '@angular/core';
import User from './domain/user/User';
import Session from 'junction-orm/lib/Session';

declare global {
  namespace Express {
    interface Request {
      injector: Injector;
      junction: Session;
      user?: User;
    }
  }
}
