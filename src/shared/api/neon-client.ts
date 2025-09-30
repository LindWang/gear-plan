import { neon } from '@neondatabase/serverless';
import { PUBLIC_NEON_DATABASE_URL } from '$env/static/public';

console.log('Neon Database URL:', PUBLIC_NEON_DATABASE_URL ? 'Connected' : 'Not configured');

// Create Neon client
export const sql = neon(PUBLIC_NEON_DATABASE_URL);

// Simple helper to handle database errors
export function handleNeonError(error: any): string {
  if (error?.message) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected database error occurred';
}

// Test connection function
export async function testNeonConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Neon connection successful:', result[0].current_time);
    return { success: true, data: result[0] };
  } catch (error) {
    console.error('❌ Neon connection failed:', error);
    return { success: false, error: handleNeonError(error) };
  }
}