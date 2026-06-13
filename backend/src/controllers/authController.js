import { authService } from "../services/authService.js";

export const authController = {
  async register(req, res) { res.status(201).json(await authService.register(req.body)); },
  async verify(req, res) { res.json(await authService.verifyEmail(req.body.token)); },
  async resend(req, res) { res.json(await authService.resendVerification(req.body.email)); },
  async login(req, res) { res.json(await authService.login(req.body)); },
  async me(req, res) { res.json(await authService.profile(req.userId)); }
};
