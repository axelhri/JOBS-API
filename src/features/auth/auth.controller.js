import { StatusCodes } from 'http-status-codes';
import * as usersService from '../users/users.service.js';
import { UnauthenticatedError } from '../../errors/index.js';

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
      let user = await User.findOne({ email });
      if (user) {
          return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
      }

      user = new User({ username, email, password });
      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(201).json({ token });
  } catch (error) {
      res.status(500).json({ message: 'Erreur serveur' });
  }
};

const login = async (req, res) => {
  const user = await usersService.get({ email: req.body.email });

  if (!user) throw new UnauthenticatedError('Identifiants invalides');

  const isPasswordCorrect = await user.comparePasswords(
    req.body.password
  );

  if (!isPasswordCorrect)
    throw new UnauthenticatedError('Identifiants invalides');

  const token = user.createAccessToken();

  res
    .status(StatusCodes.OK)
    .json({ user: { userId: user._id }, token });
};

export { login, register };
