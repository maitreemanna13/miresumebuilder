import "server-only";
import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic();

export const REFINE_MODEL = process.env.ANTHROPIC_REFINE_MODEL || "claude-opus-4-8";
