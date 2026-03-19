"use client";

import { motion } from "motion/react";
import { Globe, Mail, Shield, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";

export function StorageSettingsContent() {
  return (
    <div className="space-y-7">
      <motion.div
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={fadeInUp.transition}
      >
        <h1 className="dashboard-title text-3xl font-semibold tracking-tight">
          Settings
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account, profile, and preferences.
        </p>
      </motion.div>

      <motion.div
        className="space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* Profile */}
        <motion.div variants={staggerItem}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 p-1.5 ring-1 ring-inset ring-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                Profile
              </CardTitle>
              <CardDescription>
                Your public display name and contact info.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Display Name
                  </label>
                  <Input
                    placeholder="Your name"
                    disabled
                    className="bg-muted/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    placeholder="you@example.com"
                    disabled
                    className="bg-muted/30"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button size="sm" disabled>
                  Save Changes
                </Button>
                <Badge
                  variant="outline"
                  className="text-xs text-muted-foreground"
                >
                  Coming soon
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Custom Domain */}
        <motion.div variants={staggerItem}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 p-1.5 ring-1 ring-inset ring-primary/10">
                  <Globe className="h-4 w-4 text-primary" />
                </div>
                Custom Domain
              </CardTitle>
              <CardDescription>
                Use your own domain for gallery links instead of the default
                Fotno subdomain.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Domain
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="yourdomain.com"
                    disabled
                    className="bg-muted/30 flex-1"
                  />
                  <Button size="sm" variant="outline" disabled>
                    Verify
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Point a CNAME record to{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-[11px]">
                    galleries.fotno.com
                  </code>
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-xs text-muted-foreground"
              >
                Coming soon
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={staggerItem}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 p-1.5 ring-1 ring-inset ring-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                Notifications
              </CardTitle>
              <CardDescription>
                Control which email notifications you receive.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    label: "Client favorites",
                    desc: "When a client hearts a photo",
                  },
                  {
                    label: "Gallery views",
                    desc: "Weekly summary of gallery visits",
                  },
                  {
                    label: "Storage alerts",
                    desc: "When you reach 80% or 95% capacity",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-xl border border-border/50 p-3 transition-colors duration-200 hover:bg-muted/30"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] text-muted-foreground shrink-0"
                    >
                      Soon
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div variants={staggerItem}>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 p-1.5 ring-1 ring-inset ring-primary/10">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                Security
              </CardTitle>
              <CardDescription>
                Password and authentication settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-border/50 p-3 transition-colors duration-200 hover:bg-muted/30">
                <div>
                  <p className="text-sm font-medium">Change Password</p>
                  <p className="text-xs text-muted-foreground">
                    Update your account password
                  </p>
                </div>
                <Button size="sm" variant="outline" disabled>
                  Change
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border/50 p-3 transition-colors duration-200 hover:bg-muted/30">
                <div>
                  <p className="text-sm font-medium">
                    Two-Factor Authentication
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Add an extra layer of security
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs text-muted-foreground"
                >
                  Coming soon
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
