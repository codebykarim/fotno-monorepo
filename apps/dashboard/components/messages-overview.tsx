"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Avatar } from "@workspace/ui/components/avatar";
import { MessageSquare, Clock } from "lucide-react";

const messages = [
  {
    id: "1",
    sender: "Sarah Johnson",
    subject: "Wedding Photos - Additional Questions",
    preview: "Hi! I wanted to ask about the timeline for receiving the edited photos...",
    time: "2 min ago",
    unread: true,
    avatar: "SJ",
  },
  {
    id: "2",
    sender: "Mike Chen",
    subject: "Portrait Session Confirmation",
    preview: "Thank you for confirming the session. I'm looking forward to working with you...",
    time: "1 hour ago",
    unread: true,
    avatar: "MC",
  },
  {
    id: "3",
    sender: "Emma Wilson",
    subject: "Corporate Event Details",
    preview: "I've attached the event schedule and location details. Please let me know if...",
    time: "3 hours ago",
    unread: false,
    avatar: "EW",
  },
  {
    id: "4",
    sender: "David Brown",
    subject: "Family Photos - Rescheduling",
    preview: "Unfortunately, we need to reschedule our family photo session due to...",
    time: "1 day ago",
    unread: true,
    avatar: "DB",
  },
];

const MessagesOverview = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recent Messages
          </CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {messages.filter(m => m.unread).length} unread
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors cursor-pointer hover:bg-accent/50 ${
                message.unread ? "bg-accent/20" : "bg-card"
              }`}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <div className="flex items-center justify-center h-full w-full bg-primary text-primary-foreground text-xs font-medium">
                  {message.avatar}
                </div>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium truncate ${
                    message.unread ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {message.sender}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {message.time}
                  </div>
                </div>
                <p className={`text-sm truncate ${
                  message.unread ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {message.subject}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-1">
                  {message.preview}
                </p>
              </div>
              {message.unread && (
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagesOverview;
