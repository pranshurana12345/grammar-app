"use client";

import type { RuleStatus } from "./storage";

// Cloud sync is disabled — app uses local per-student storage.
export async function pushRuleStatus(_ruleId: number, _status: RuleStatus) {}
export async function pushQuizScore(_ruleId: number, _score: number, _passed: boolean) {}
export async function pullProgress(): Promise<Record<number, RuleStatus> | null> { return null; }
export async function pushAllProgress(_progress: Record<number, RuleStatus>) {}
