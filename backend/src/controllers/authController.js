import { authService } from "../services/authService.js";

// El controller traduce cada request HTTP en una llamada al servicio. No
// contiene reglas de negocio ni accede directamente a MongoDB.
export const authController = {
  async register(req, res) { res.status(201).json(await authService.register(req.body)); },
  async verify(req, res) { res.json(await authService.verifyEmail(req.body.token)); },
  async resend(req, res) { res.json(await authService.resendVerification(req.body.email)); },
  async login(req, res) { res.json(await authService.login(req.body)); },
  async me(req, res) { res.json(await authService.profile(req.userId)); },
  async updateAvatar(req, res) { res.json(await authService.updateAvatar(req.userId, req.body.avatarUrl)); }
};
