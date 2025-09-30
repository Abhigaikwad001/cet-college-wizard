import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ScholarshipSuggestions } from "@/components/ScholarshipSuggestions";
import { usePrediction } from "@/hooks/usePrediction";
import { Bookmark, TrendingUp, MapPin, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const categories = ["OPEN", "OBC", "SC", "ST", "EWS"];
const branches = ["CSE", "IT", "MECH", "CIVIL", "E&TC", "EE", "Any"];
const cities = ["Pune", "Mumbai", "Nagpur", "Nashik", "Aurangabad", "Any"];
const quotas = ["Home University", "Outside University", "Any"];

const EnhancedScoreInput = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { results, loading, predictColleges } = usePrediction();

  const [score, setScore] = useState("");
  const [category, setCategory] = useState("");
  const [branch, setBranch] = useState("");
  const [location, setLocation] = useState("Any");
  const [quota, setQuota] = useState("Any");

  const handlePredict = async () => {
    if (!score || !category || !branch) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const scoreNum = parseFloat(score);
    if (scoreNum < 0 || scoreNum > 200) {
      toast({
        title: "Invalid Score",
        description: "Score must be between 0 and 200",
        variant: "destructive",
      });
      return;
    }

    await predictColleges({
      score: scoreNum,
      category,
      branch,
      location,
      quota,
    });
  };

  const handleBookmark = async (collegeId: string, branchName: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to save colleges",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      // Get branch ID
      const { data: branchData } = await supabase
        .from("branches")
        .select("id")
        .eq("name", branchName)
        .single();

      if (!branchData) {
        throw new Error("Branch not found");
      }

      const { error } = await supabase.from("user_bookmarks").insert({
        user_id: user.id,
        college_id: collegeId,
        branch_id: branchData.id,
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already Saved",
            description: "This college is already in your bookmarks",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Saved!",
          description: "College added to your bookmarks",
        });
      }
    } catch (error) {
      console.error("Error bookmarking:", error);
      toast({
        title: "Error",
        description: "Failed to save college",
        variant: "destructive",
      });
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 75) return "text-green-600 bg-green-50";
    if (probability >= 50) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getProbabilityLabel = (probability: number) => {
    if (probability >= 75) return "High Chance";
    if (probability >= 50) return "Moderate Chance";
    return "Low Chance";
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">College Predictor</h1>
          <p className="text-muted-foreground">
            Enter your details to get personalized college recommendations
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Details</CardTitle>
            <CardDescription>Fill in your CET score and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="score">CET Score *</Label>
                <Input
                  id="score"
                  type="number"
                  min="0"
                  max="200"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="Enter your score (0-200)"
                />
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Branch Preference *</Label>
                <Select value={branch} onValueChange={setBranch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((br) => (
                      <SelectItem key={br} value={br}>
                        {br}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Preferred Location</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quota Preference</Label>
                <Select value={quota} onValueChange={setQuota}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quota" />
                  </SelectTrigger>
                  <SelectContent>
                    {quotas.map((q) => (
                      <SelectItem key={q} value={q}>
                        {q}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={handlePredict} disabled={loading} className="w-full">
                  {loading ? "Predicting..." : "Predict Colleges"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {category && <ScholarshipSuggestions category={category} />}

        {results.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Your College Recommendations
              </h2>
              <p className="text-muted-foreground">
                Found {results.length} colleges matching your criteria
              </p>
            </div>

            <div className="grid gap-6">
              {results.map((college) => (
                <Card key={`${college.id}-${college.branch_name}`} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl">{college.name}</CardTitle>
                          <Badge className={getProbabilityColor(college.probability)}>
                            {college.probability}% - {getProbabilityLabel(college.probability)}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {college.city}, {college.location}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleBookmark(college.id, college.branch_name)}
                      >
                        <Bookmark className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Branch</p>
                        <p className="font-semibold">{college.branch_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="font-semibold">{college.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Cutoff Rank</p>
                        <p className="font-semibold">{college.cutoff_rank.toLocaleString()}</p>
                      </div>
                      {college.fees_per_year && (
                        <div>
                          <p className="text-sm text-muted-foreground">Annual Fees</p>
                          <p className="font-semibold">₹{college.fees_per_year.toLocaleString()}</p>
                        </div>
                      )}
                      {college.naac_rating && (
                        <div>
                          <p className="text-sm text-muted-foreground">NAAC Rating</p>
                          <p className="font-semibold">{college.naac_rating}</p>
                        </div>
                      )}
                      {college.nirf_rank && (
                        <div>
                          <p className="text-sm text-muted-foreground">NIRF Rank</p>
                          <p className="font-semibold">#{college.nirf_rank}</p>
                        </div>
                      )}
                      {college.average_package && (
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Package</p>
                          <p className="font-semibold flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            ₹{college.average_package.toLocaleString()} LPA
                          </p>
                        </div>
                      )}
                      {college.placement_percentage && (
                        <div>
                          <p className="text-sm text-muted-foreground">Placement Rate</p>
                          <p className="font-semibold">{college.placement_percentage}%</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedScoreInput;