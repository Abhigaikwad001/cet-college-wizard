import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const SeedDataPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const seedSampleData = async () => {
    setLoading(true);
    try {
      // Sample Branches
      const branches = [
        { code: "CSE", name: "Computer Science Engineering", category: "Engineering" },
        { code: "IT", name: "Information Technology", category: "Engineering" },
        { code: "MECH", name: "Mechanical Engineering", category: "Engineering" },
        { code: "CIVIL", name: "Civil Engineering", category: "Engineering" },
        { code: "E&TC", name: "Electronics & Telecommunication", category: "Engineering" },
        { code: "EE", name: "Electrical Engineering", category: "Engineering" },
      ];

      const { data: branchData, error: branchError } = await supabase
        .from("branches")
        .upsert(branches, { onConflict: "code" })
        .select();

      if (branchError) throw branchError;

      // Sample Colleges
      const colleges = [
        {
          name: "College of Engineering, Pune (COEP)",
          location: "Shivajinagar",
          city: "Pune",
          type: "Government",
          university: "Pune University",
          naac_rating: "A++",
          nirf_rank: 45,
          fees_per_year: 85000,
          hostel_available: true,
        },
        {
          name: "Veermata Jijabai Technological Institute (VJTI)",
          location: "Matunga",
          city: "Mumbai",
          type: "Government",
          university: "Mumbai University",
          naac_rating: "A++",
          nirf_rank: 52,
          fees_per_year: 90000,
          hostel_available: true,
        },
        {
          name: "Walchand College of Engineering, Sangli",
          location: "Vishrambag",
          city: "Sangli",
          type: "Government",
          university: "Shivaji University",
          naac_rating: "A+",
          nirf_rank: 125,
          fees_per_year: 78000,
          hostel_available: true,
        },
      ];

      const { data: collegeData, error: collegeError } = await supabase
        .from("colleges")
        .upsert(colleges, { onConflict: "name" })
        .select();

      if (collegeError) throw collegeError;

      // Sample Cutoff Data
      const cutoffData = [];
      for (const college of collegeData || []) {
        for (const branch of branchData || []) {
          const categories = ["OPEN", "OBC", "SC", "ST", "EWS"];
          const quotas = ["Home University", "Outside University"];

          for (const cat of categories) {
            for (const quota of quotas) {
              const baseRank = Math.floor(Math.random() * 50000) + 5000;
              cutoffData.push({
                college_id: college.id,
                branch_id: branch.id,
                year: 2024,
                round: 1,
                category: cat,
                quota: quota,
                cutoff_rank: baseRank,
                seats_available: Math.floor(Math.random() * 100) + 20,
              });
            }
          }
        }
      }

      const { error: cutoffError } = await supabase
        .from("cutoff_data")
        .upsert(cutoffData);

      if (cutoffError) throw cutoffError;

      // Sample Placement Data
      const placementData = [];
      for (const college of collegeData || []) {
        for (const branch of branchData || []) {
          placementData.push({
            college_id: college.id,
            branch_id: branch.id,
            year: 2024,
            average_package: Math.floor(Math.random() * 800000) + 400000,
            highest_package: Math.floor(Math.random() * 2000000) + 1000000,
            placement_percentage: Math.floor(Math.random() * 30) + 70,
            top_recruiters: ["TCS", "Infosys", "Wipro", "Cognizant"],
          });
        }
      }

      const { error: placementError } = await supabase
        .from("placement_data")
        .upsert(placementData);

      if (placementError) throw placementError;

      // Sample Scholarships
      const scholarships = [
        {
          name: "Post Matric Scholarship",
          description: "Government scholarship for SC/ST students",
          eligibility_category: ["SC", "ST"],
          income_limit: 250000,
          amount: 50000,
          provider: "Government of Maharashtra",
        },
        {
          name: "EBC Scholarship",
          description: "Scholarship for economically backward classes",
          eligibility_category: ["EWS", "OBC"],
          income_limit: 100000,
          amount: 30000,
          provider: "Government of Maharashtra",
        },
      ];

      const { error: scholarshipError } = await supabase
        .from("scholarships")
        .upsert(scholarships);

      if (scholarshipError) throw scholarshipError;

      // Sample CAP Rounds
      const capRounds = [
        {
          year: 2025,
          round_number: 1,
          round_name: "CAP Round 1",
          start_date: "2025-07-01",
          end_date: "2025-07-15",
          description: "First round of centralized admissions",
          required_documents: ["CET Scorecard", "10th Marksheet", "12th Marksheet", "Domicile Certificate"],
        },
        {
          year: 2025,
          round_number: 2,
          round_name: "CAP Round 2",
          start_date: "2025-07-20",
          end_date: "2025-08-05",
          description: "Second round for remaining seats",
          required_documents: ["CET Scorecard", "10th Marksheet", "12th Marksheet", "Domicile Certificate"],
        },
      ];

      const { error: capError } = await supabase
        .from("cap_rounds")
        .upsert(capRounds, { onConflict: "year,round_number" });

      if (capError) throw capError;

      // Sample Admission Alerts
      const alerts = [
        {
          title: "CAP Round 1 Applications Open",
          message: "First round of CAP admissions is now open. Submit your applications before July 15, 2025.",
          alert_type: "info",
          start_date: "2025-06-25",
          end_date: "2025-07-15",
          is_active: true,
        },
      ];

      const { error: alertError } = await supabase
        .from("admission_alerts")
        .upsert(alerts);

      if (alertError) throw alertError;

      toast({
        title: "Success!",
        description: "Sample data seeded successfully",
      });
    } catch (error) {
      console.error("Error seeding data:", error);
      toast({
        title: "Error",
        description: "Failed to seed data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Seed Sample Data</CardTitle>
            <CardDescription>
              This will populate the database with sample colleges, cutoffs, and other data for testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={seedSampleData} disabled={loading} className="w-full">
              {loading ? "Seeding Data..." : "Seed Sample Data"}
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              Note: This is for development/testing purposes only. Use this to populate your database
              with sample data to test the application.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeedDataPage;