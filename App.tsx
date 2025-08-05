import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginForm } from "./components/LoginForm";
import { Navigation } from "./components/Navigation";
import { Dashboard } from "./components/Dashboard";
import { NovaOcorrencia } from "./components/NovaOcorrencia";
import { ConsultarBoletins } from "./components/ConsultarBoletins";
import { GestaoPessoas } from "./components/GestaoPessoas";
import { GestaoPoliciais } from "./components/GestaoPoliciais";
import { MapaCrimes } from "./components/MapaCrimes";
import { BuscaAvancada } from "./components/BuscaAvancada";
import { CorrelacaoCrimes } from "./components/CorrelacaoCrimes";
import { Relatorios } from "./components/Relatorios";
import { Toaster } from "./components/ui/sonner";

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "nova-ocorrencia":
        return <NovaOcorrencia />;
      case "consultar":
        return <ConsultarBoletins />;
      case "pessoas":
        return <GestaoPessoas />;
      case "policiais":
        return <GestaoPoliciais />;
      case "mapa-crimes":
        return <MapaCrimes />;
      case "busca-avancada":
        return <BuscaAvancada />;
      case "correlacao":
        return <CorrelacaoCrimes />;
      case "relatorios":
        return <Relatorios />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
      <Toaster />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}