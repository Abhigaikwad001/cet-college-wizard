import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Bookmark {
  id: string;
  college: {
    name: string;
    location: string;
    city: string;
    type: string;
  };
  branch: {
    name: string;
    code: string;
  };
  notes: string | null;
}

const BookmarksPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  const fetchBookmarks = async () => {
    try {
      const { data, error } = await supabase
        .from("user_bookmarks")
        .select(`
          id,
          notes,
          college:colleges(name, location, city, type),
          branch:branches(name, code)
        `)
        .eq("user_id", user?.id);

      if (error) throw error;
      setBookmarks(data || []);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      toast({
        title: "Error",
        description: "Failed to load bookmarks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookmarkId: string) => {
    try {
      const { error } = await supabase
        .from("user_bookmarks")
        .delete()
        .eq("id", bookmarkId);

      if (error) throw error;

      setBookmarks(bookmarks.filter((b) => b.id !== bookmarkId));
      toast({
        title: "Success",
        description: "Bookmark removed",
      });
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      toast({
        title: "Error",
        description: "Failed to delete bookmark",
        variant: "destructive",
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Saved Colleges</h1>
          <p className="text-muted-foreground">Your bookmarked colleges and branches</p>
        </div>

        {bookmarks.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No bookmarks yet</p>
              <Button onClick={() => navigate("/predict")}>Start Predicting</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {bookmarks.map((bookmark) => (
              <Card key={bookmark.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{bookmark.college.name}</CardTitle>
                      <CardDescription>
                        {bookmark.college.city}, {bookmark.college.location}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(bookmark.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Branch:</span>
                      <span>{bookmark.branch.name} ({bookmark.branch.code})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Type:</span>
                      <span>{bookmark.college.type}</span>
                    </div>
                    {bookmark.notes && (
                      <div className="mt-4 p-3 bg-muted rounded-md">
                        <p className="text-sm text-muted-foreground">Notes: {bookmark.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;