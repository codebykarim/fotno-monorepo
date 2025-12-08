import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { FolderOpen } from "lucide-react";

export default function AlbumsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Albums</h1>
        <p className="text-muted-foreground">
          Manage client albums and photo delivery.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Client Albums
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Album management will be implemented here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
