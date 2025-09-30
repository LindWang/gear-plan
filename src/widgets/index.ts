// Central widget exports for cleaner imports
// Use: import { GearForm, GearList, GearStats, WeightSummary } from '@/widgets';

export { default as GearForm } from './gear-form/index.js';
export { default as GearList } from './gear-list/index.js';
export { default as GearStats } from './gear-stats/index.js';
export { default as WeightSummary } from './weight-summary/index.js';

// Widget metadata for development and debugging
export const WIDGET_REGISTRY = {
  'gear-form': {
    name: 'Gear Form',
    description: 'Add new gear items with validation and category selection',
    component: () => import('./gear-form/index.js')
  },
  'gear-list': {
    name: 'Gear List',
    description: 'Display and manage gear items with sorting and filtering',
    component: () => import('./gear-list/index.js')
  },
  'gear-stats': {
    name: 'Gear Statistics',
    description: 'Show gear analytics and weight distribution visualization',
    component: () => import('./gear-stats/index.js')
  },
  'weight-summary': {
    name: 'Weight Summary',
    description: 'Display total weight and category breakdown with progress bars',
    component: () => import('./weight-summary/index.js')
  }
} as const;

export type WidgetKey = keyof typeof WIDGET_REGISTRY;