import { User, UserRole } from 'src/users/entities/user.entity';

declare module 'express-session' {
  interface SessionData {
    user: User;
  }
}

declare module 'express' {
  interface Request {
    user: User;
  }
}
