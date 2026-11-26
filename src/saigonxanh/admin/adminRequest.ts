import { request } from '../../api';
export const getErrMsg = (value: any, fallback = 'Không thể xử lý yêu cầu'): string =>
  typeof value?.error?.message === 'string' ? value.error.message : typeof value?.error === 'string' ? value.error : typeof value?.message === 'string' ? value.message : fallback;
export async function authFetch(url: string, init?: RequestInit): Promise<Response> {
  try {
    const result = await request(url.replace(/^\/api/, ''), init);
    return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: { message: error.message } }), { status: error.status || 500, headers: { 'Content-Type': 'application/json' } });
  }
}
