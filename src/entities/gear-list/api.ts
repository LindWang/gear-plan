import { sql, handleNeonError } from '@/shared/api/neon-client.js';
import { BaseApiService } from '@/shared/api/base-service.js';
import type { GearList, GearListInsert, ApiResponse } from '../gear/types.js';

/**
 * Neon-based Gear List Service
 * Simple, reliable alternative to Supabase
 */
export class NeonGearListService extends BaseApiService {
  constructor() {
    super({ serviceName: 'NeonGearListService' });
  }

  /**
   * Get all gear lists for a user
   */
  async getUserLists(userId: string): Promise<ApiResponse<GearList[]>> {
    return this.executeOperation(
      'getUserLists',
      userId,
      async () => {
        const result = await sql`
          SELECT * FROM gear_lists 
          WHERE user_id = ${userId}
          ORDER BY updated_at DESC
        `;
        return result as GearList[];
      }
    );
  }

  /**
   * Create a new gear list
   */
  async createList(list: GearListInsert): Promise<ApiResponse<GearList>> {
    return this.executeSingleItemOperation(
      'createList',
      list,
      async () => {
        const result = await sql`
          INSERT INTO gear_lists (user_id, name, description, trip_type)
          VALUES (${list.user_id}, ${list.name}, ${list.description || null}, ${list.trip_type || 'day_hike'})
          RETURNING *
        `;
        return result as GearList[];
      }
    );
  }

  /**
   * Get a specific gear list by ID
   */
  async getListById(listId: string): Promise<ApiResponse<GearList>> {
    return this.executeSingleItemOperation(
      'getListById',
      listId,
      async () => {
        const result = await sql`
          SELECT * FROM gear_lists 
          WHERE id = ${listId}
        `;
        return result as GearList[];
      },
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
      async () => {
        const result = await sql`
          UPDATE gear_lists 
          SET 
            name = COALESCE(${updates.name}, name),
            description = COALESCE(${updates.description}, description),
            trip_type = COALESCE(${updates.trip_type}, trip_type),
            updated_at = NOW()
          WHERE id = ${listId}
          RETURNING *
        `;
        return result as GearList[];
      },
      'Gear list not found'
    );
  }

  /**
   * Delete a gear list
   */
  async deleteList(listId: string): Promise<ApiResponse<boolean>> {
    return this.executeBooleanOperation(
      'deleteList',
      listId,
      async () => {
        return await sql`
          DELETE FROM gear_lists 
          WHERE id = ${listId}
        `;
      }
    );
  }
}