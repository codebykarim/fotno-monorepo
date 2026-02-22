"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { jsonFetcher } from "@/lib/api/client";
import { ListClientsResponse } from "@/lib/types/api";

export function ClientsListContent() {
  const { data, isLoading } = useSWR<ListClientsResponse>("/api/clients", jsonFetcher);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <p className="text-muted-foreground">Clients and galleries shared with each contact.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2">Galleries</th>
                </tr>
              </thead>
              <tbody>
                {isLoading &&
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-3 pr-4">
                        <Skeleton className="h-4 w-28" />
                      </td>
                      <td className="py-3 pr-4">
                        <Skeleton className="h-4 w-40" />
                      </td>
                      <td className="py-3">
                        <Skeleton className="h-4 w-52" />
                      </td>
                    </tr>
                  ))}

                {!isLoading &&
                  data?.clients.map((client) => (
                    <tr key={client.id} className="border-b">
                      <td className="py-3 pr-4 font-medium">{client.name}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{client.email}</td>
                      <td className="py-3 text-muted-foreground">
                        {client.galleries.length > 0
                          ? client.galleries.map((gallery) => gallery.title).join(", ")
                          : "No galleries shared"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
