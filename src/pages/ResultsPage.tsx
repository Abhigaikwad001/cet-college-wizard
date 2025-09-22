import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PredictionData {
  score: number;
  category: string;
  branch: string;
}

interface College {
  id: number;
  name: string;
  branch: string;
  cutoff: number;
  location: string;
  type: string;
  rank: string;
}

const ResultsPage = () => {
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [colleges, setColleges] = useState<College[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem("cetPredictionData");
    if (storedData) {
      const data = JSON.parse(storedData);
      setPredictionData(data);
      generateColleges(data);
    }
  }, []);

  const generateColleges = (data: PredictionData) => {
    // Generate dummy college data based on score
    const baseColleges: Omit<College, 'id' | 'cutoff'>[] = [
      { name: "College of Engineering, Pune (COEP)", branch: "Computer Engineering", location: "Pune", type: "Government", rank: "Top Tier" },
      { name: "Veermata Jijabai Technological Institute (VJTI)", branch: "Information Technology", location: "Mumbai", type: "Government", rank: "Top Tier" },
      { name: "Government College of Engineering, Aurangabad", branch: "Mechanical Engineering", location: "Aurangabad", type: "Government", rank: "Tier 1" },
      { name: "Walchand College of Engineering, Sangli", branch: "Electronics Engineering", location: "Sangli", type: "Government", rank: "Tier 1" },
      { name: "Maharashtra Institute of Technology, Pune", branch: "Computer Engineering", location: "Pune", type: "Private", rank: "Tier 2" },
      { name: "D.Y. Patil College of Engineering", branch: "Civil Engineering", location: "Pune", type: "Private", rank: "Tier 2" },
      { name: "Bharati Vidyapeeth College of Engineering", branch: "Electrical Engineering", location: "Pune", type: "Private", rank: "Tier 2" },
      { name: "K.K. Wagh Institute of Engineering", branch: "Mechanical Engineering", location: "Nashik", type: "Private", rank: "Tier 3" },
    ];

    // Generate colleges based on score with appropriate cutoffs
    const generatedColleges = baseColleges.map((college, index) => {
      let cutoffAdjustment = 0;
      
      // Adjust cutoff based on category
      switch (data.category) {
        case 'open':
          cutoffAdjustment = 0;
          break;
        case 'obc':
          cutoffAdjustment = -10;
          break;
        case 'sc':
        case 'st':
          cutoffAdjustment = -20;
          break;
        case 'ews':
          cutoffAdjustment = -5;
          break;
        default:
          cutoffAdjustment = -15;
      }

      const baseCutoff = data.score - (index * 5) + Math.random() * 10 - 5;
      const cutoff = Math.max(1, Math.floor(baseCutoff + cutoffAdjustment));

      return {
        id: index + 1,
        ...college,
        cutoff,
        branch: data.branch === 'engineering' ? college.branch : `${data.branch.charAt(0).toUpperCase() + data.branch.slice(1)} Studies`,
      };
    }).filter(college => college.cutoff <= data.score).sort((a, b) => b.cutoff - a.cutoff);

    setColleges(generatedColleges.slice(0, 6));
  };

  if (!predictionData) {
    return (
      <div className="min-h-screen bg-gradient-card flex items-center justify-center">
        <Card className="card-elevated p-8 text-center">
          <CardHeader>
            <CardTitle>No Prediction Data Found</CardTitle>
            <CardDescription>Please go back and enter your details first.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/predict">
              <Button className="btn-hero">Enter Your Score</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-card py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your College Predictions
          </h1>
          <div className="flex justify-center items-center space-x-4 mb-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Score: {predictionData.score}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Category: {predictionData.category.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Branch: {predictionData.branch}
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground">
            Based on your score and preferences, here are your best college options
          </p>
        </div>

        {colleges.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {colleges.map((college, index) => (
              <Card key={college.id} className={`card-elevated animate-slide-up hover:scale-105 transition-transform duration-300`} style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={college.type === 'Government' ? 'default' : 'secondary'}>
                      {college.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {college.rank}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{college.name}</CardTitle>
                  <CardDescription className="text-sm">{college.branch}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Cutoff Score:</span>
                      <Badge variant="destructive" className="font-bold">
                        {college.cutoff}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Location:</span>
                      <span className="text-sm font-medium">{college.location}</span>
                    </div>
                    <div className="pt-2">
                      <div className={`text-xs px-2 py-1 rounded-full text-center font-medium ${
                        predictionData.score >= college.cutoff + 10 
                          ? 'bg-secondary/20 text-secondary' 
                          : predictionData.score >= college.cutoff 
                          ? 'bg-accent/20 text-accent' 
                          : 'bg-destructive/20 text-destructive'
                      }`}>
                        {predictionData.score >= college.cutoff + 10 
                          ? 'High Chance' 
                          : predictionData.score >= college.cutoff 
                          ? 'Good Chance' 
                          : 'Reach College'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="card-elevated text-center p-8 mb-8">
            <CardHeader>
              <CardTitle>No Colleges Found</CardTitle>
              <CardDescription>
                No colleges match your current score and preferences. Consider retaking the exam or exploring other options.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <div className="flex justify-center space-x-4 animate-fade-in">
          <Link to="/">
            <Button variant="outline" size="lg">
              Back to Home
            </Button>
          </Link>
          <Link to="/predict">
            <Button className="btn-hero" size="lg">
              Try Different Score
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;