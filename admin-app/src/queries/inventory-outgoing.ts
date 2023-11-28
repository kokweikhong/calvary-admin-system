import { InventoryOutgoing } from "@/interfaces/inventory";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

const inOutgoingURL = `${process.env.NEXT_PUBLIC_MAIN_SERVICE_URL}/api/v1/inventory/outgoings`;

export const useGetInventoryOutgoings = () => {
  return useQuery("outgoings", async () => {
    const { data } = await axios.get(inOutgoingURL);
    return data as InventoryOutgoing[];
  });
};

export const useGetInventoryOutgoing = (id: string) => {
  return useQuery(["outgoing", id], async () => {
    const { data } = await axios.get(`${inOutgoingURL}/${id}`);
    return data as InventoryOutgoing;
  });
};

export const useCreateInventoryOutgoing = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (outgoing: InventoryOutgoing) => {
      await axios
        .post(inOutgoingURL, outgoing)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          throw new Error(`${error.response.data.message}`);
        });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("outgoings");
      },
    }
  );
};

export const useUpdateInventoryOutgoing = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    async (outgoing: InventoryOutgoing) => {
      await axios
        .put(`${inOutgoingURL}/${id}`, outgoing)
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          throw new Error(`${error.response.data.message}`);
        });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("outgoings");
      },
    }
  );
};

export const useDeleteInventoryOutgoing = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: string) => {
      const { data } = await axios.delete(`${inOutgoingURL}/${id}`);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("outgoings");
      },
    }
  );
};
