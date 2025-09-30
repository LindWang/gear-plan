// Base API service utilities for consistent error handling and logging
import type { ApiResponse } from '@/entities/gear/types.js';

/**
 * Configuration for API service operations
 */
export interface ApiServiceConfig {
  serviceName: string;
  enableLogging?: boolean;
}

/**
 * Base API service class with common patterns
 */
export class BaseApiService {
  protected serviceName: string;
  protected enableLogging: boolean;

  constructor(config: ApiServiceConfig) {
    this.serviceName = config.serviceName;
    this.enableLogging = config.enableLogging ?? true;
  }

  /**
   * Log operation start
   */
  protected logStart(operation: string, params?: any): void {
    if (this.enableLogging) {
      console.log(`${this.serviceName}.${operation} called${params ? ' with:' : ''}`, params);
    }
  }

  /**
   * Log operation success
   */
  protected logSuccess(operation: string, result?: any): void {
    if (this.enableLogging) {
      console.log(`✅ ${this.serviceName} ${operation} successful${result ? ':' : ''}`, result);
    }
  }

  /**
   * Log operation error
   */
  protected logError(operation: string, error: any): void {
    if (this.enableLogging) {
      console.error(`❌ ${this.serviceName} ${operation} failed:`, error);
    }
  }

  /**
   * Execute an API operation with standardized error handling and logging
   */
  protected async executeOperation<T>(
    operation: string,
    params: any,
    apiCall: () => Promise<T>
  ): Promise<ApiResponse<T>> {
    this.logStart(operation, params);
    
    try {
      const result = await apiCall();
      this.logSuccess(operation, result);
      
      return {
        data: result,
        error: null,
        success: true
      };
    } catch (error) {
      this.logError(operation, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      return {
        data: null,
        error: errorMessage,
        success: false
      };
    }
  }

  /**
   * Execute an operation that returns a boolean result (like delete operations)
   */
  protected async executeBooleanOperation(
    operation: string,
    params: any,
    apiCall: () => Promise<boolean | any>,
    notFoundMessage?: string
  ): Promise<ApiResponse<boolean>> {
    this.logStart(operation, params);
    
    try {
      const result = await apiCall();
      
      // Handle database operations that return empty arrays or no results
      if (Array.isArray(result) && result.length === 0) {
        return {
          data: false,
          error: notFoundMessage || 'Item not found',
          success: false
        };
      }
      
      this.logSuccess(operation);
      
      return {
        data: true,
        error: null,
        success: true
      };
    } catch (error) {
      this.logError(operation, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      return {
        data: false,
        error: errorMessage,
        success: false
      };
    }
  }

  /**
   * Execute an operation that should return a single item
   */
  protected async executeSingleItemOperation<T>(
    operation: string,
    params: any,
    apiCall: () => Promise<T[] | T>,
    notFoundMessage?: string
  ): Promise<ApiResponse<T>> {
    this.logStart(operation, params);
    
    try {
      const result = await apiCall();
      
      if (Array.isArray(result)) {
        if (result.length === 0) {
          return {
            data: null,
            error: notFoundMessage || 'Item not found',
            success: false
          };
        }
        const item = result[0];
        this.logSuccess(operation);
        return {
          data: item,
          error: null,
          success: true
        };
      }
      
      this.logSuccess(operation);
      return {
        data: result,
        error: null,
        success: true
      };
    } catch (error) {
      this.logError(operation, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      return {
        data: null,
        error: errorMessage,
        success: false
      };
    }
  }
}

/**
 * Enhanced error handling for database operations
 */
export function handleDatabaseError(error: any): string {
  if (error?.message) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected database error occurred';
}