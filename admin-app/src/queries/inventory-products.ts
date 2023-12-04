import {
  InventoryProduct,
  InventoryProductSummary,
} from "@/interfaces/inventory";
import { RankingInfo } from "@tanstack/match-sorter-utils";
import { FilterFn } from "@tanstack/react-table";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
// import { axiosPrivate } from "@/queries/axios";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const inProductsURL = "http://localhost:8080/api/v1/inventory/products";


export const useGetInventoryProducts = () => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery("inventory-products", async () => {
    const { data } = await axiosPrivate.get("/inventory/products");
    return data as InventoryProduct[];
  });
};

export const useGetInventoryProduct = (id: string) => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery(
    ["inventory-product", id],
    async () => {
      const { data } = await axiosPrivate.get(`inventory/products/${id}`);
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
      await axios.post(inProductsURL, data).then((response) => {
        return response.data;
      }
      ).catch((error) => {
        throw new Error(`${error.response.data.message}`);
      });
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
      await axios.put(`${inProductsURL}/${id}`, data).then((response) => {
        return response.data;
      }).catch((error) => {
        throw new Error(`${error.response.data.message}`);
      });
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

export const useGetInventoryProductSummary = () => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery("inventory-product-summary", async () => {
    const { data } = await axiosPrivate.get(`/inventory/products/summary`);
    return data as InventoryProductSummary[];
  });
};
