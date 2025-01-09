import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function updateCredits(credits: number) {
  document.getElementById(
    "credits"
  )!.innerHTML = `Credits <strong>${credits}</strong>`;
}
