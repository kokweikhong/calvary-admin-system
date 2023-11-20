import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { InventoryProduct } from "@/app/interfaces/inventory";

const inProductsURL = "http://localhost:8080/api/v1/inventory/products";

export const useGetInventoryProducts = () => {
  return useQuery("inventory-products", async () => {
    const { data } = await axios.get(inProductsURL);
    return data as InventoryProduct[];
  });
};

export const useGetInventoryProduct = (id: string) => {
  return useQuery(
    ["inventory-product", id],
    async () => {
      const { data } = await axios.get(`${inProductsURL}/${id}`);
      return data as InventoryProduct;
    },
    {
      enabled: !!id,
    }
  );
};

export const useCreateInventoryProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: InventoryProduct) => {
      const response = await axios.post(inProductsURL, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("inventory-products");
      },
    }
  );
};

export const useUpdateInventoryProduct = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: InventoryProduct) => {
      const response = await axios.put(`${inProductsURL}/${id}`, data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("inventory-products");
      },
    }
  );
};

export const useDeleteInventoryProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: string) => {
      const response = await axios.delete(`${inProductsURL}/${id}`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("inventory-products");
      },
    }
  );
};
