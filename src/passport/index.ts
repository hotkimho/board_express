import passport from 'passport';
import * as local from './localStrategy';
import * as jwt from './jwtStrategy';
import { User } from '../models/user';
import bcrypt from 'bcrypt';

export function passportConfig() {
  local.applyLocal();
  jwt.applyJwt();
}
