import { getAccessToken } from '../../api';
export async function uploadAdminImage(file: File): Promise<string> {
  const token = getAccessToken();
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/public/saigonxanh/admin/upload', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || json.message || 'Upload ảnh thất bại');
  }
  return json.data?.url || json.url;
}

