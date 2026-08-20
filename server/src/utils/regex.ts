export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function exactCaseInsensitive(value: string) {
  return new RegExp(`^${escapeRegExp(value)}$`, "i");
}
