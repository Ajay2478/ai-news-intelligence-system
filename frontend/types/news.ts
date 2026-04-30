/**
 * NewsItem (Production-Ready, Flexible + Safe)
 * -------------------------------------------
 * - Handles real-world backend inconsistencies
 * - Strong typing without breaking UI
 * - Compatible with filtering + charts
 */

export type EntityMap = Record<string, string[]>;

export type NewsItem = {
  id: number;
  title: string;
  summary: string;

  // Keywords for category + search
  keywords: string[];

  /**
   * Entities can come in 2 formats:
   * 1. Grouped (expected):
   *    { PERSON: ["Modi"], ORG: ["ICRA"] }
   *
   * 2. Flat (fallback from backend bugs / legacy):
   *    ["Modi", "India"]
   */
  entities?: EntityMap | string[];

  // Importance score (0–100)
  importance?: number;

  // Timestamps (optional depending on API)
  created_at?: string;
  published_at?: string;
};