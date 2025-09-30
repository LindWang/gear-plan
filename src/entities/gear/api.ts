import { sql } from '@/shared/api/neon-client.js';
import { BaseApiService } from '@/shared/api/base-service.js';
import type { 
  GearItem, 
  GearItemInsert, 
  GearItemUpdate,
  ApiResponse 
} from './types.js';

export class GearItemService extends BaseApiService {
  constructor() {
    super({ serviceName: 'GearItemService' });
  }

  // Create a new gear item
  async createItem(itemData: GearItemInsert): Promise<ApiResponse<GearItem>> {
    return this.executeSingleItemOperation(
      'createItem',
      itemData,
      async () => {
        const result = await sql`
          INSERT INTO gear_items (
            list_id, name, description, category, weight_grams, 
            quantity, is_packed, is_worn, purchase_url, notes
          ) VALUES (
            ${itemData.list_id}, ${itemData.name}, ${itemData.description || null}, ${itemData.category}, ${itemData.weight_grams || 0}, 
            ${itemData.quantity || 1}, ${itemData.is_packed || false}, ${itemData.is_worn || false}, ${itemData.purchase_url || null}, ${itemData.notes || null}
          )
          RETURNING *
        `;
        return result as GearItem[];
      }
    );
  }

  // Get all items for a gear list
  async getItemsByListId(listId: string): Promise<ApiResponse<GearItem[]>> {
    return this.executeOperation(
      'getItemsByListId',
      listId,
      async () => {
        const result = await sql`
          SELECT * FROM gear_items 
          WHERE list_id = ${listId}
          ORDER BY created_at DESC
        `;
        return result as GearItem[];
      }
    );
  }

  // Update a gear item
  async updateItem(itemId: string, updates: GearItemUpdate): Promise<ApiResponse<GearItem>> {
    return this.executeSingleItemOperation(
      'updateItem',
      { itemId, updates },
      async () => {
        const result = await sql`
          UPDATE gear_items 
          SET 
            name = COALESCE(${updates.name}, name),
            description = COALESCE(${updates.description}, description),
            category = COALESCE(${updates.category}, category),
            weight_grams = COALESCE(${updates.weight_grams}, weight_grams),
            quantity = COALESCE(${updates.quantity}, quantity),
            is_packed = COALESCE(${updates.is_packed}, is_packed),
            is_worn = COALESCE(${updates.is_worn}, is_worn),
            purchase_url = COALESCE(${updates.purchase_url}, purchase_url),
            notes = COALESCE(${updates.notes}, notes),
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${itemId}
          RETURNING *
        `;
        return result as GearItem[];
      },
      'Gear item not found'
    );
  }

  // Delete a gear item
  async deleteItem(itemId: string): Promise<ApiResponse<boolean>> {
    return this.executeBooleanOperation(
      'deleteItem',
      itemId,
      async () => {
        const result = await sql`
          DELETE FROM gear_items 
          WHERE id = ${itemId}
          RETURNING id
        `;
        return result;
      },
      'Gear item not found'
    );
  }
}