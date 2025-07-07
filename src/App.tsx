
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Prompts from "./pages/Prompts";
import Rules from "./pages/Rules";
import MyRules from "./pages/MyRules";
import MyPrompts from "./pages/MyPrompts";
import Tools from "./pages/Tools";
import PromptDetail from "./pages/PromptDetail";
import RuleDetail from "./pages/RuleDetail";
import MCPDetail from "./pages/MCPDetail";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./hooks/useAuth";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/prompts" element={<Prompts />} />
              <Route path="/prompts/:id" element={<PromptDetail />} />
              <Route path="/my-prompts" element={<MyPrompts />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/rules/:id" element={<RuleDetail />} />
              <Route path="/my-rules" element={<MyRules />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/mcp/:id" element={<MCPDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
