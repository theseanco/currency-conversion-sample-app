// Simple fetcher util based on swr docs
export default async function fetcher(url: string) {
  const result = await fetch(url)
  return result.json();
}
