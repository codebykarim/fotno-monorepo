"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Clock, Calendar, MapPin } from "lucide-react";

const upcomingEvents = [
  {
    id: "1",
    title: "Wedding Consultation",
    client: "Sarah & Tom",
    date: "Today",
    time: "2:00 PM",
    location: "Coffee Shop Downtown",
    type: "consultation",
  },
  {
    id: "2",
    title: "Portrait Session",
    client: "Mike Chen",
    date: "Tomorrow",
    time: "10:30 AM",
    location: "Studio A",
    type: "session",
  },
  {
    id: "3",
    title: "Wedding Shoot",
    client: "Sarah Johnson",
    date: "Jan 15",
    time: "2:00 PM",
    location: "Central Park, NYC",
    type: "wedding",
  },
  {
    id: "4",
    title: "Equipment Maintenance",
    client: "",
    date: "Jan 16",
    time: "9:00 AM",
    location: "Studio",
    type: "maintenance",
  },
];

const typeColors = {
  consultation: "bg-blue-100 text-blue-800",
  session: "bg-green-100 text-green-800",
  wedding: "bg-purple-100 text-purple-800",
  maintenance: "bg-gray-100 text-gray-800",
};

const UpcomingSchedule = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Upcoming Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">
                    {event.title}
                  </p>
                  <Badge
                    className={typeColors[event.type as keyof typeof typeColors]}
                    variant="secondary"
                  >
                    {event.type}
                  </Badge>
                </div>
                {event.client && (
                  <p className="text-xs text-muted-foreground">
                    {event.client}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {event.time}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {event.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingSchedule;
