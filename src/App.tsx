import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import EnhancedScoreInput from "./pages/EnhancedScoreInput";
import ResultsPage from "./pages/ResultsPage";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/AuthPage";
import BookmarksPage from "./pages/BookmarksPage";
import ComparisonPage from "./pages/ComparisonPage";
import CounselingPage from "./pages/CounselingPage";
import SeedDataPage from "./pages/SeedDataPage";
import NotFound from "./pages/NotFound";
import { AIChatbot } from "./components/AIChatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/predict" element={<EnhancedScoreInput />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/comparison" element={<ComparisonPage />} />
            <Route path="/counseling" element={<CounselingPage />} />
            <Route path="/seed-data" element={<SeedDataPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AIChatbot />
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
