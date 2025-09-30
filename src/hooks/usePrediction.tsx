import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PredictionFilters {
  score: number;
  category: string;
  branch: string;
  location?: string;
  quota?: string;
}

export interface CollegeResult {
  id: string;
  name: string;
  location: string;
  city: string;
  type: string;
  naac_rating: string | null;
  nirf_rank: number | null;
  fees_per_year: number | null;
  branch_name: string;
  cutoff_rank: number;
  probability: number;
  seats_available: number | null;
  average_package: number | null;
  highest_package: number | null;
  placement_percentage: number | null;
}

export const usePrediction = () => {
  const [results, setResults] = useState<CollegeResult[]>([]);
  const [loading, setLoading] = useState(false);

  const predictColleges = async (filters: PredictionFilters) => {
    setLoading(true);
    try {
      // Convert score to approximate rank (simplified formula)
      const estimatedRank = Math.max(1, Math.floor((200 - filters.score) * 500));

      // Fetch cutoff data with college and branch details
      let query = supabase
        .from("cutoff_data")
        .select(`
          cutoff_rank,
          seats_available,
          colleges (
            id,
            name,
            location,
            city,
            type,
            naac_rating,
            nirf_rank,
            fees_per_year
          ),
          branches (
            name,
            code
          ),
          placement_data (
            average_package,
            highest_package,
            placement_percentage
          )
        `)
        .eq("category", filters.category)
        .eq("year", new Date().getFullYear() - 1) // Last year's data
        .gte("cutoff_rank", estimatedRank - 5000)
        .lte("cutoff_rank", estimatedRank + 10000)
        .order("cutoff_rank", { ascending: true })
        .limit(50);

      if (filters.branch && filters.branch !== "Any") {
        query = query.eq("branches.code", filters.branch);
      }

      if (filters.quota && filters.quota !== "Any") {
        query = query.eq("quota", filters.quota);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching predictions:", error);
        throw error;
      }

      // Process and calculate probabilities
      const processedResults: CollegeResult[] = (data || [])
        .map((item: any) => {
          const rankDiff = item.cutoff_rank - estimatedRank;
          let probability = 0;

          if (estimatedRank <= item.cutoff_rank) {
            probability = 85 + Math.min(15, Math.floor((item.cutoff_rank - estimatedRank) / 100));
          } else if (estimatedRank <= item.cutoff_rank + 2000) {
            probability = 60 + Math.floor((2000 - (estimatedRank - item.cutoff_rank)) / 100);
          } else if (estimatedRank <= item.cutoff_rank + 5000) {
            probability = 30 + Math.floor((5000 - (estimatedRank - item.cutoff_rank)) / 200);
          } else {
            probability = Math.max(5, 30 - Math.floor((estimatedRank - item.cutoff_rank - 5000) / 300));
          }

          const placementData = item.placement_data?.[0];

          return {
            id: item.colleges.id,
            name: item.colleges.name,
            location: item.colleges.location,
            city: item.colleges.city,
            type: item.colleges.type,
            naac_rating: item.colleges.naac_rating,
            nirf_rank: item.colleges.nirf_rank,
            fees_per_year: item.colleges.fees_per_year,
            branch_name: item.branches.name,
            cutoff_rank: item.cutoff_rank,
            probability: Math.min(99, Math.max(1, probability)),
            seats_available: item.seats_available,
            average_package: placementData?.average_package || null,
            highest_package: placementData?.highest_package || null,
            placement_percentage: placementData?.placement_percentage || null,
          };
        })
        .filter((result: CollegeResult) => {
          if (filters.location && filters.location !== "Any") {
            return result.city === filters.location;
          }
          return true;
        });

      setResults(processedResults);
    } catch (error) {
      console.error("Prediction error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, predictColleges };
};