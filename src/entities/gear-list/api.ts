import { BaseApiService } from '@/shared/api/base-service.js';
import * as db from '@/shared/api/demo-db.js';
import type { GearList, GearListInsert, ApiResponse } from '../gear/types.js';

/**
 * Gear list service for the demo build.
 *
 * Same public surface as the upstream Neon-backed service, but backed by
 * browser-local data (`@/shared/api/demo-db.js`) — no server, no database.
 */
export class GearListService extends BaseApiService {
  constructor() {
    super({ serviceName: 'GearListService' });
  }

  /**
   * Get all gear lists for a user
   */
  async getUserLists(userId: string): Promise<ApiResponse<GearList[]>> {
    return this.executeOperation('getUserLists', userId, async () => db.getUserLists(userId));
  }

  /**
   * Create a new gear list
   */
  async createList(list: GearListInsert): Promise<ApiResponse<GearList>> {
    return this.executeSingleItemOperation('createList', list, async () => db.createList(list));
  }

  /**
   * Get a specific gear list by ID
   */
  async getListById(listId: string): Promise<ApiResponse<GearList>> {
    return this.executeSingleItemOperation(
      'getListById',
      listId,
      async () => db.getListById(listId),
      'Gear list not found'
    );
  }

  /**
   * Update a gear list
   */
  async updateList(listId: string, updates: Partial<GearListInsert>): Promise<ApiResponse<GearList>> {
    return this.executeSingleItemOperation(
      'updateList',
      { listId, updates },
      async () => db.updateList(listId, updates),
      'Gear list not found'
    );
  }

  /**
   * Delete a gear list (its items go with it)
   */
  async deleteList(listId: string): Promise<ApiResponse<boolean>> {
    return this.executeBooleanOperation('deleteList', listId, async () => db.deleteList(listId));
  }
}
