"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Calendar,
  Camera,
  MessageSquare,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Star,
} from "lucide-react";

const stats = [
  {
    title: "Total Bookings",
    value: "24",
    change: "+12%",
    icon: Calendar,
    trend: "up",
  },
  {
    title: "Active Sessions",
    value: "8",
    change: "+3",
    icon: Camera,
    trend: "up",
  },
  {
    title: "Revenue (This Month)",
    value: "$12,450",
    change: "+18%",
    icon: DollarSign,
    trend: "up",
  },
  {
    title: "Client Satisfaction",
    value: "4.9",
    change: "+0.2",
    icon: Star,
    trend: "up",
  },
];

const DashboardStats = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }
                >
                  {stat.change}
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
