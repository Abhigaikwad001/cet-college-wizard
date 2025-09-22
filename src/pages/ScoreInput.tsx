import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ScoreInput = () => {
  const [score, setScore] = useState("");
  const [category, setCategory] = useState("");
  const [branch, setBranch] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 0 && Number(value) <= 200)) {
      setScore(value);
    }
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  const handleBranchChange = (value: string) => {
    setBranch(value);
  };

  const handlePredictCollege = () => {
    if (!score || !category || !branch) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all fields to get predictions.",
        variant: "destructive",
      });
      return;
    }

    if (Number(score) < 1 || Number(score) > 200) {
      toast({
        title: "Invalid Score",
        description: "Please enter a valid CET score between 1 and 200.",
        variant: "destructive",
      });
      return;
    }

    // Store the input data for results page
    localStorage.setItem("cetPredictionData", JSON.stringify({
      score: Number(score),
      category,
      branch,
    }));

    toast({
      title: "Prediction Generated!",
      description: "Redirecting to your college predictions...",
    });

    setTimeout(() => {
      navigate("/results");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-card py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Enter Your CET Details
          </h1>
          <p className="text-lg text-muted-foreground">
            Provide your score and preferences to get personalized college predictions
          </p>
        </div>

        <Card className="card-elevated animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Prediction Form</CardTitle>
            <CardDescription className="text-center">
              Fill in the details below to get your college recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="score" className="text-sm font-medium">
                CET Score (1-200)
              </Label>
              <Input
                id="score"
                type="number"
                placeholder="Enter your CET score"
                value={score}
                onChange={handleScoreChange}
                min="1"
                max="200"
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Category</Label>
              <Select onValueChange={handleCategoryChange}>
                <SelectTrigger className="text-lg">
                  <SelectValue placeholder="Select your category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="obc">OBC</SelectItem>
                  <SelectItem value="sc">SC</SelectItem>
                  <SelectItem value="st">ST</SelectItem>
                  <SelectItem value="ews">EWS</SelectItem>
                  <SelectItem value="vjnt">VJNT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Branch Preference</Label>
              <Select onValueChange={handleBranchChange}>
                <SelectTrigger className="text-lg">
                  <SelectValue placeholder="Select preferred branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="veterinary">Veterinary</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handlePredictCollege}
              className="w-full btn-hero mt-8"
              size="lg"
            >
              Predict My Colleges
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScoreInput;