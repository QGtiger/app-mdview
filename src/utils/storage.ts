import type { LocalShare } from "@/types/share";

const STORAGE_KEY = "mdview:my-shares";

export function getMyShares(): LocalShare[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalShare[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addMyShare(share: LocalShare) {
  const list = getMyShares();
  if (list.some((s) => s.slug === share.slug)) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([share, ...list]));
}

export function removeMyShare(slug: string) {
  const list = getMyShares().filter((s) => s.slug !== slug);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
