import { useQuery } from "@tanstack/react-query";
import { User } from "@/types";

const fetchUser = async (): Promise<User> => {
  const response = await fetch("/api/users/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
};

export const useUser = () => {
  return useQuery<User, Error>({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
    staleTime: Infinity,
  });
};
