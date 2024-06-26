import { Router } from "express";

const router = Router();

router.post("/version", (req, res) => {
  const agentVersion = process.env.VERSION_ENC;

  res.json({ version: agentVersion });
});

export default router;
