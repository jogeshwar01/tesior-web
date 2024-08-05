import { fetcher } from "@/lib/utils";
import useSWRImmutable from "swr/immutable";

export default function useUserRepos(username: string) {
  const fetchApiUrl = `https://api.github.com/users/${username}/repos?per_page=100&page=1`;

  const { data, error } = useSWRImmutable(fetchApiUrl, fetcher);
  let userRepos: {
    name: string;
    url: string;
  }[] = [];
  if (data) {
    // Check if data is undefined or not an array
    userRepos = Array.isArray(data)
      ? data.map((repo: any) => ({
          name: repo.name,
          url: repo.url,
        }))
      : [];
  }

  return {
    repos: userRepos,
    isLoading: !error && !data,
    isError: error,
  };
}
