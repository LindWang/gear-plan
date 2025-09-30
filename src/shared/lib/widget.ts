// Shared widget utilities
import type { ComponentType } from 'svelte';

/**
 * Creates a standardized widget export
 * This eliminates the need for individual index.ts files in each widget
 */
export function createWidget<T extends ComponentType>(component: T): T {
  return component;
}

/**
 * Widget metadata for better debugging and development
 */
export interface WidgetMeta {
  name: string;
  description: string;
  version: string;
}

/**
 * Enhanced widget factory with metadata
 */
export function createWidgetWithMeta<T extends ComponentType>(
  component: T, 
  meta: WidgetMeta
): T & { __meta: WidgetMeta } {
  (component as any).__meta = meta;
  return component as T & { __meta: WidgetMeta };
}