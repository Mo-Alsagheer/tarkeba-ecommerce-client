import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isTokenExpired(token: string): boolean {
  try {
    const payloadStart = token.indexOf('.') + 1;
    const payloadEnd = token.lastIndexOf('.');
    
    if (payloadStart === 0 || payloadEnd === -1) return true;
    
    const payload = token.slice(payloadStart, payloadEnd);
    const decodedPayload = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    
    if (!decodedPayload.exp) return false;
    
    // Check if token is expired with 10 second buffer
    return decodedPayload.exp * 1000 < Date.now() + 10000;
  } catch {
    return true;
  }
}
