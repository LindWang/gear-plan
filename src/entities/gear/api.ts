import { BaseApiService } from '@/shared/api/base-service.js';
import * as db from '@/shared/api/demo-db.js';
import type { GearItem, GearItemInsert, GearItemUpdate, ApiResponse } from './types.js';

/**
 * Gear item service for the demo build.
 *
 * Same public surface as the upstream Neon-backed service, but backed by
 * browser-local data (`@/shared/api/demo-db.js`) — no server, no database.
 */
export class GearItemService extends BaseApiService {
  constructor() {
    super({ serviceName: 'GearItemService' });
  }

  // Create a new gear item
  async createItem(itemData: GearItemInsert): Promise<ApiResponse<GearItem>> {
    return this.executeSingleItemOperation('createItem', itemData, async () => db.createItem(itemData));
  }

  // Get all items for a gear list
  async getItemsByListId(listId: string): Promise<ApiResponse<GearItem[]>> {
    return this.executeOperation('getItemsByListId', listId, async () => db.getItemsByListId(listId));
  }

  // Update a gear item
  async updateItem(itemId: string, updates: GearItemUpdate): Promise<ApiResponse<GearItem>> {
    return this.executeSingleItemOperation(
      'updateItem',
      { itemId, updates },
      async () => db.updateItem(itemId, updates),
      'Gear item not found'
    );
  }

  // Delete a gear item
  async deleteItem(itemId: string): Promise<ApiResponse<boolean>> {
    return this.executeBooleanOperation(
      'deleteItem',
      itemId,
      async () => db.deleteItem(itemId),
      'Gear item not found'
    );
  }
}
