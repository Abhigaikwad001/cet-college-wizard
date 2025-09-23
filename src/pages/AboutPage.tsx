import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Abhishek Gaikwad",
      role: "Frontend Developer",
      description: "UI/UX design and React development",
    },
    {
      name: "Sarthak Kad",
      role: "Backend Developer",
      description: "API development and database management",
    },
    {
      name: "Shivaraj Phatangare",
      role: "Data Analyst",
      description: "Cutoff analysis and prediction algorithms",
    },
    {
      name: "Pranav Ozarde",
      role: "Full Stack Developer",
      description: "System architecture and integration",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-card py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            About MHT-CET College Predictor
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A comprehensive tool designed to help students make informed decisions about their college admissions based on MHT-CET scores.
          </p>
        </div>

        {/* Project Description */}
        <Card className="card-elevated mb-12 animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl">Project Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">What is MHT-CET College Predictor?</h3>
              <p className="text-muted-foreground leading-relaxed">
                The MHT-CET College Predictor is an intelligent web application that helps students predict their 
                college admission chances based on their CET scores, category, and branch preferences. Our system 
                analyzes historical cutoff data to provide accurate predictions for various engineering and pharmacy 
                colleges across Maharashtra.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Features</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Badge variant="secondary">✓ Score-based Predictions</Badge>
                  <p className="text-sm text-muted-foreground">Accurate college predictions based on your CET score</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="secondary">✓ Category-wise Analysis</Badge>
                  <p className="text-sm text-muted-foreground">Customized results for different reservation categories</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="secondary">✓ Multiple Streams</Badge>
                  <p className="text-sm text-muted-foreground">Support for Engineering, Pharmacy, and other courses</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="secondary">✓ Instant Results</Badge>
                  <p className="text-sm text-muted-foreground">Get your predictions within seconds</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">How It Works</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our prediction algorithm analyzes your CET score along with your category and branch preference 
                to match you with colleges where you have the highest chances of admission. The system considers 
                historical cutoff trends, seat availability, and category-specific reservations to provide 
                personalized recommendations.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8 animate-fade-in">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={member.name} className="card-elevated text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription>
                    <Badge variant="outline" className="mb-2">{member.role}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <Card className="card-elevated animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl">Technology Stack</CardTitle>
            <CardDescription>Built with modern web technologies for optimal performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">React</Badge>
              <Badge variant="default">TypeScript</Badge>
              <Badge variant="default">Tailwind CSS</Badge>
              <Badge variant="default">React Router</Badge>
              <Badge variant="default">Shadcn/ui</Badge>
              <Badge variant="default">Vite</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;