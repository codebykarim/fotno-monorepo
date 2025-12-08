import DashboardStats from "../components/dashboard-stats";
import RecentBookings from "../components/recent-bookings";
import UpcomingSchedule from "../components/upcoming-schedule";
import MessagesOverview from "../components/messages-overview";
import AlbumRequests from "../components/album-requests";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your photography business today.
          </p>
        </div>
      </div>

      {/* Analytics/Stats Cards */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Recent Bookings */}
        <RecentBookings />

        {/* Upcoming Schedule */}
        <UpcomingSchedule />
      </div>

      {/* Messages and Album Requests */}
      <div className="grid gap-6 xl:grid-cols-2">
        <MessagesOverview />
        <AlbumRequests />
      </div>
    </div>
  );
}
