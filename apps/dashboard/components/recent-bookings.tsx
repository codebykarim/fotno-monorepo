"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Avatar } from "@workspace/ui/components/avatar";
import { Calendar, Clock, MapPin } from "lucide-react";

const recentBookings = [
  {
    id: "1",
    client: "Sarah Johnson",
    type: "Wedding Photography",
    date: "2025-01-15",
    time: "14:00",
    location: "Central Park, NYC",
    status: "confirmed",
    avatar: "SJ",
  },
  {
    id: "2",
    client: "Mike Chen",
    type: "Portrait Session",
    date: "2025-01-18",
    time: "10:30",
    location: "Studio A",
    status: "pending",
    avatar: "MC",
  },
  {
    id: "3",
    client: "Emma Wilson",
    type: "Corporate Event",
    date: "2025-01-20",
    time: "16:00",
    location: "Downtown Conference Center",
    status: "confirmed",
    avatar: "EW",
  },
  {
    id: "4",
    client: "David Brown",
    type: "Family Photos",
    date: "2025-01-22",
    time: "11:00",
    location: "Riverside Park",
    status: "confirmed",
    avatar: "DB",
  },
  {
    id: "5",
    client: "Lisa Garcia",
    type: "Engagement Shoot",
    date: "2025-01-25",
    time: "17:30",
    location: "Brooklyn Bridge",
    status: "pending",
    avatar: "LG",
  },
];

const statusColors = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
};

const RecentBookings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Recent Bookings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <div className="flex items-center justify-center h-full w-full bg-primary text-primary-foreground text-sm font-medium">
                    {booking.avatar}
                  </div>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {booking.client}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {booking.type}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {booking.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {booking.time}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {booking.location}
                  </div>
                </div>
              </div>
              <Badge
                className={statusColors[booking.status as keyof typeof statusColors]}
                variant="secondary"
              >
                {booking.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentBookings;
