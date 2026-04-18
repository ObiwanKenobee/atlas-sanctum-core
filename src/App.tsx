import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AssetPage from "./pages/AssetPage.tsx";
import AllocatePage from "./pages/AllocatePage.tsx";
import ValidatePage from "./pages/ValidatePage.tsx";
import PortfolioPage from "./pages/PortfolioPage.tsx";
import SISPage from "./pages/SISPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/asset/:id" element={<AssetPage />} />
          <Route path="/allocate/:id" element={<AllocatePage />} />
          <Route path="/validate" element={<ValidatePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/sis" element={<SISPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
