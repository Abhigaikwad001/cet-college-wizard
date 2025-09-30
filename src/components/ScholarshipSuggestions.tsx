import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface Scholarship {
  id: string;
  name: string;
  description: string | null;
  eligibility_category: string[];
  income_limit: number | null;
  amount: number | null;
  provider: string | null;
  application_link: string | null;
  deadline: string | null;
}

interface ScholarshipSuggestionsProps {
  category: string;
}

export const ScholarshipSuggestions = ({ category }: ScholarshipSuggestionsProps) => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScholarships();
  }, [category]);

  const fetchScholarships = async () => {
    const { data, error } = await supabase
      .from("scholarships")
      .select("*")
      .contains("eligibility_category", [category])
      .order("amount", { ascending: false });

    if (!error && data) {
      setScholarships(data);
    }
    setLoading(false);
  };

  if (loading) {
    return <div>Loading scholarships...</div>;
  }

  if (scholarships.length === 0) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Available Scholarships</CardTitle>
        <CardDescription>
          Scholarships you may be eligible for based on your category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scholarships.map((scholarship) => (
            <Card key={scholarship.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{scholarship.name}</CardTitle>
                    {scholarship.provider && (
                      <CardDescription>by {scholarship.provider}</CardDescription>
                    )}
                  </div>
                  {scholarship.amount && (
                    <Badge variant="secondary" className="text-lg">
                      ₹{scholarship.amount.toLocaleString()}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {scholarship.description && <p className="text-sm">{scholarship.description}</p>}
                {scholarship.income_limit && (
                  <p className="text-sm text-muted-foreground">
                    Income Limit: ₹{scholarship.income_limit.toLocaleString()} per annum
                  </p>
                )}
                {scholarship.deadline && (
                  <p className="text-sm text-muted-foreground">
                    Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                  </p>
                )}
                {scholarship.application_link && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={scholarship.application_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      Apply Now <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};