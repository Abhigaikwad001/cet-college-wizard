import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface College {
  id: string;
  name: string;
  location: string;
  city: string;
  type: string;
  naac_rating: string | null;
  nirf_rank: number | null;
  fees_per_year: number | null;
  hostel_available: boolean;
}

const ComparisonPage = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [selected1, setSelected1] = useState<string>("");
  const [selected2, setSelected2] = useState<string>("");
  const [college1, setCollege1] = useState<College | null>(null);
  const [college2, setCollege2] = useState<College | null>(null);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    const { data, error } = await supabase
      .from("colleges")
      .select("*")
      .order("name");

    if (!error && data) {
      setColleges(data);
    }
  };

  const handleCompare = () => {
    const c1 = colleges.find((c) => c.id === selected1);
    const c2 = colleges.find((c) => c.id === selected2);
    setCollege1(c1 || null);
    setCollege2(c2 || null);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">College Comparison</h1>
          <p className="text-muted-foreground">Compare two colleges side by side</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Colleges to Compare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Select value={selected1} onValueChange={setSelected1}>
                <SelectTrigger>
                  <SelectValue placeholder="Select first college" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map((college) => (
                    <SelectItem key={college.id} value={college.id}>
                      {college.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selected2} onValueChange={setSelected2}>
                <SelectTrigger>
                  <SelectValue placeholder="Select second college" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map((college) => (
                    <SelectItem key={college.id} value={college.id}>
                      {college.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button onClick={handleCompare} disabled={!selected1 || !selected2}>
                Compare
              </Button>
            </div>
          </CardContent>
        </Card>

        {college1 && college2 && (
          <Card>
            <CardHeader>
              <CardTitle>Comparison Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Parameter</TableHead>
                    <TableHead className="w-1/3">{college1.name}</TableHead>
                    <TableHead className="w-1/3">{college2.name}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Location</TableCell>
                    <TableCell>{college1.city}, {college1.location}</TableCell>
                    <TableCell>{college2.city}, {college2.location}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Type</TableCell>
                    <TableCell>{college1.type}</TableCell>
                    <TableCell>{college2.type}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">NAAC Rating</TableCell>
                    <TableCell>{college1.naac_rating || "N/A"}</TableCell>
                    <TableCell>{college2.naac_rating || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">NIRF Rank</TableCell>
                    <TableCell>{college1.nirf_rank || "N/A"}</TableCell>
                    <TableCell>{college2.nirf_rank || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Annual Fees</TableCell>
                    <TableCell>
                      {college1.fees_per_year ? `₹${college1.fees_per_year.toLocaleString()}` : "N/A"}
                    </TableCell>
                    <TableCell>
                      {college2.fees_per_year ? `₹${college2.fees_per_year.toLocaleString()}` : "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Hostel Available</TableCell>
                    <TableCell>{college1.hostel_available ? "Yes" : "No"}</TableCell>
                    <TableCell>{college2.hostel_available ? "Yes" : "No"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ComparisonPage;