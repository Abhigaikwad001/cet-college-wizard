import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface CAPRound {
  id: string;
  year: number;
  round_number: number;
  round_name: string;
  start_date: string;
  end_date: string;
  description: string | null;
  required_documents: string[];
}

const CounselingPage = () => {
  const [capRounds, setCapRounds] = useState<CAPRound[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCAPRounds();
  }, []);

  const fetchCAPRounds = async () => {
    try {
      const { data, error } = await supabase
        .from("cap_rounds")
        .select("*")
        .order("year", { ascending: false })
        .order("round_number");

      if (error) throw error;
      setCapRounds(data || []);
    } catch (error) {
      console.error("Error fetching CAP rounds:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">CAP Counseling Guide</h1>
          <p className="text-muted-foreground">
            Complete guide to Centralized Admission Process (CAP) rounds
          </p>
        </div>

        {/* General Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What is CAP?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The Centralized Admission Process (CAP) is conducted by the Directorate of Technical
              Education (DTE), Maharashtra for admissions to various professional courses including
              Engineering, Pharmacy, and other technical programs.
            </p>
            <p>
              CAP consists of multiple rounds where students can choose their preferred colleges based
              on their CET rank and cutoffs. Understanding the process is crucial for making informed
              decisions.
            </p>
          </CardContent>
        </Card>

        {/* CAP Process Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>CAP Process Steps</CardTitle>
            <CardDescription>Follow these steps carefully for successful admission</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="step1">
                <AccordionTrigger>Step 1: Registration</AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <p>Register on the official DTE CAP portal with your CET application number.</p>
                  <p className="font-medium">Required Documents:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>CET Scorecard</li>
                    <li>10th & 12th Mark Sheets</li>
                    <li>Domicile Certificate</li>
                    <li>Caste Certificate (if applicable)</li>
                    <li>Income Certificate (if applicable)</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step2">
                <AccordionTrigger>Step 2: Document Verification</AccordionTrigger>
                <AccordionContent>
                  <p>Upload scanned copies of all required documents. Ensure:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Documents are clear and legible</li>
                    <li>File sizes are within limits</li>
                    <li>All documents are properly certified</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step3">
                <AccordionTrigger>Step 3: Option Form Filling</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Choose your preferred colleges and branches. You can select multiple options in order
                    of preference. Important tips:
                  </p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Fill maximum options for better chances</li>
                    <li>Arrange in true order of preference</li>
                    <li>Consider both home and outside university quota</li>
                    <li>Check cutoffs from previous years</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step4">
                <AccordionTrigger>Step 4: Seat Allotment</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Based on your rank, category, and preferences, a seat will be allotted. Check your
                    allotment status on the portal.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="step5">
                <AccordionTrigger>Step 5: Acceptance & Confirmation</AccordionTrigger>
                <AccordionContent>
                  <p>If satisfied with your allotment:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Accept the seat and pay admission fees</li>
                    <li>Complete document verification at the college</li>
                    <li>Confirm your admission</li>
                  </ul>
                  <p className="mt-2">
                    Note: You can participate in subsequent rounds for upgrades, but ensure you don't
                    lose your current seat.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* CAP Rounds Schedule */}
        {capRounds.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>CAP Rounds Schedule</CardTitle>
              <CardDescription>Important dates for upcoming CAP rounds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {capRounds.map((round) => (
                  <Card key={round.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{round.round_name}</CardTitle>
                        <Badge>{round.year}</Badge>
                      </div>
                      <CardDescription>
                        {new Date(round.start_date).toLocaleDateString()} -{" "}
                        {new Date(round.end_date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    {round.description && (
                      <CardContent>
                        <p className="mb-4">{round.description}</p>
                        {round.required_documents && round.required_documents.length > 0 && (
                          <div>
                            <p className="font-medium mb-2">Required Documents:</p>
                            <ul className="list-disc list-inside space-y-1">
                              {round.required_documents.map((doc, index) => (
                                <li key={index}>{doc}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips & Important Points */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Important Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  Keep checking the official DTE website regularly for updates and announcements
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  Don't miss any deadlines - late submissions are usually not accepted
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  Take print-outs of all submitted forms and payment receipts
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  Verify your details multiple times before final submission
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  Use our college predictor to make informed choices while filling option forms
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CounselingPage;