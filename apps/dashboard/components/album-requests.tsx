"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Avatar } from "@workspace/ui/components/avatar";
import { FolderOpen, Clock, Check, X } from "lucide-react";

const albumRequests = [
  {
    id: "1",
    client: "Sarah Johnson",
    event: "Wedding Photography",
    date: "Jan 15, 2025",
    status: "pending",
    priority: "high",
    photos: 150,
    avatar: "SJ",
  },
  {
    id: "2",
    client: "Mike Chen",
    event: "Portrait Session",
    date: "Jan 18, 2025",
    status: "in-progress",
    priority: "medium",
    photos: 45,
    avatar: "MC",
  },
  {
    id: "3",
    client: "Emma Wilson",
    event: "Corporate Event",
    date: "Jan 20, 2025",
    status: "pending",
    priority: "low",
    photos: 200,
    avatar: "EW",
  },
];

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
};

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-orange-100 text-orange-800",
  low: "bg-gray-100 text-gray-800",
};

const AlbumRequests = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Album Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {albumRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <div className="flex items-center justify-center h-full w-full bg-primary text-primary-foreground text-sm font-medium">
                    {request.avatar}
                  </div>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-none">
                      {request.client}
                    </p>
                    <Badge
                      className={
                        priorityColors[
                          request.priority as keyof typeof priorityColors
                        ]
                      }
                      variant="secondary"
                    >
                      {request.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {request.event}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {request.date}
                    </div>
                    <span>{request.photos} photos</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    statusColors[request.status as keyof typeof statusColors]
                  }
                  variant="secondary"
                >
                  {request.status}
                </Badge>
                {request.status === "pending" && (
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlbumRequests;
