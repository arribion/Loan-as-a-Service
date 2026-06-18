import express from "express";

const packageTier_Router = express.Router();

// controllers
import { getPackageTiers } from "../controllers/package.Tier.Controller.js";

packageTier_Router.get("/tiers", getPackageTiers);
export default packageTier_Router;