import passport from 'passport';
import * as local from './localStrategy';
import * as jwt from './jwtStrategy';
import { User } from '../models/user';

export const passportConfig = () => {
  local.applyLocalPassport();
  jwt.applyJwtPassport();
};
