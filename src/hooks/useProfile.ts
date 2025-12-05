import { useQuery } from "@tanstack/react-query";
import { api } from "./api";

export const UserProfile = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => api.get("user/profile").then((res) => res.data),
  });
};
