"use client";

import { Card, CardBody, CardFooter, CardHeader } from "@/components/Card";
import {
  SearchableColumnProps,
  useInventoryTable,
} from "@/hooks/inventory-table";
import {
  InventoryOutgoing,
  fakeInventoryOutgoings,
} from "@/interfaces/inventory";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";

const columnHelper = createColumnHelper<InventoryOutgoing>();

export default function InventoryOutgoingPage() {
  const [multipleSearch, setMultipleSearch] = useState(false);
  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
    }),
    columnHelper.accessor("status", {
      header: "Status",
    }),
    columnHelper.accessor("refNo", {
      header: "Ref No",
    }),
  ];

  const searchColumns: SearchableColumnProps[] = [
    {
      label: "ID",
      value: "id",
      placeholder: "Search ID",
    },
    {
      label: "Ref No",
      value: "refNo",
      placeholder: "Search Ref No",
    },
  ];

  const {
    InventoryTable,
    InTablePagination,
    // InTableSearchColumnsInput,
    InTableGlobalSearch,
    InTableFilter,
  } = useInventoryTable({
    columns: columns as any,
    data: fakeInventoryOutgoings,
    searchableColumns: searchColumns,
  });
  // const { InTablePagination } = useInventoryTableComponents({
  //   table: table,
  // });
  return (
    <div>
      <div>
        <Card>
          <CardHeader>
            <h2>Outgoing</h2>
            <div>
              <InTableGlobalSearch />
            </div>
            <button onClick={() => setMultipleSearch(!multipleSearch)}>
              Set
            </button>
            <div>{/* <InTableSearchColumnsInput /> */}</div>
            <div>{InTableFilter("id")}</div>
          </CardHeader>
          <CardBody>
            <InventoryTable />
          </CardBody>
          <CardFooter>
            <div className="">
              <InTablePagination />
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
