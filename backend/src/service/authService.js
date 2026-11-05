import bcrypt from 'bcryptjs';
import { createUser, findUserByEmail } from '../model/userModel.js';
import { signToken } from '../lib/token.js';
import { AppError } from '../lib/errors.js';

const toPublicUser = (user) => ({ id: user.id, email: user.email });

export const registerService = async ({ email, password }) => {
    const existing = await findUserByEmail(email);
    if (existing) {
        throw new AppError(409, 'Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({ email, passwordHash });

    return { token: signToken(user.id), user: toPublicUser(user) };
};

export const loginService = async ({ email, password }) => {
    const user = await findUserByEmail(email);
    // Same error whether the email is unknown or the password is wrong, so we
    // don't leak which emails are registered.
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        throw new AppError(401, 'Invalid email or password');
    }

    return { token: signToken(user.id), user: toPublicUser(user) };
};
