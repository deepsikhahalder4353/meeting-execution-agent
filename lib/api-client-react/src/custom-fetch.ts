export type AuthTokenGetter = () => string | Promise<string>;

let baseUrl = "";
let tokenGetter: AuthTokenGetter | null = null;

export function setBaseUrl(url: string) {
  baseUrl = url;
}

export function setAuthTokenGetter(getter: AuthTokenGetter) {
  tokenGetter = getter;
}

export async function customFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const token = tokenGetter ? await tokenGetter() : null;
  const headers = new Headers(options?.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const response = await fetch(`${baseUrl}${url}`, {
    ...options,
    headers,
  });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}
