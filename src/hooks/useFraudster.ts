import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";

export interface IParams {
  search?: string;
  passportSeriya?: string;
  passportCode?: string;
}

export const useFraudsters = () => {
  const queryClient = useQueryClient();

  const getFraudster = (props: IParams) =>
    useQuery({
      queryKey: ["fraudster", props],
      queryFn: () =>
        api.get("/fraudster", { params: props }).then((res) => res.data),
    });

  const getFraudsterCount = () =>
    useQuery({
      queryKey: ["fraudster-count"],
      queryFn: () => api.get("/fraudster/count").then((res) => res.data),
    });

  const getFraudsterSearch = (props: IParams) =>
    useQuery({
      queryKey: ["fraudster-search", props],
      queryFn: async () => {
        const response = await api.get("/fraudster/search", { params: props });
        // Backend returns { message, count, data: [...] }
        // Return just the data array
        return response.data?.data || [];
      },
      enabled: false,
    });

  const getFraudsterMyCount = () =>
    useQuery({
      queryKey: ["fraudster-my-count"],
      queryFn: async () => {
        const response = await api.get("/fraudster/my-count");
        // Backend returns { count, data: [...] }
        // Return just the data array
        return response.data?.data || [];
      },
    });

  const getOneFraudster = (id: string) =>
    useQuery({
      queryKey: ["fraudster", id],
      queryFn: () => api.get(`/fraudster/${id}`).then((res) => res.data),
    });

  const createFraudster = useMutation({
    mutationFn: (body: any) =>
      api.post("/fraudster", body).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fraudster"] });
      queryClient.invalidateQueries({ queryKey: ["fraudster-my-count"] });
    },
    onError: (error) => {
      console.error("Create fraudster failed:", error);
    },
  });

  const deleteFraudster = useMutation({
    mutationFn: (id: string) =>
      api.delete(`/fraudster/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fraudster-my-count"] });
      queryClient.invalidateQueries({ queryKey: ["fraudster"] });
    },
    onError: (error) => {
      console.error("Delete fraudster failed:", error);
    },
  });

  return {
    getFraudster,
    deleteFraudster,
    getFraudsterCount,
    getFraudsterMyCount,
    getFraudsterSearch,
    createFraudster,
    getOneFraudster,
  };
};
