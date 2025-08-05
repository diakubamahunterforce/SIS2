import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Home, 
  Plus, 
  Search, 
  Users, 
  Shield, 
  BarChart3, 
  LogOut,
  MapPin,
  ScanFace,
  Network,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { alertasDistrito } from '../data/mockData';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const alertasAtivos = alertasDistrito.filter(a => a.status === 'ativo').length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'nova-ocorrencia', label: 'Nova Ocorrência', icon: Plus },
    { id: 'consultar', label: 'Consultar B.O.', icon: Search },
    { id: 'pessoas', label: 'Gestão Pessoas', icon: Users },
    { id: 'policiais', label: 'Gestão Policiais', icon: Shield },
    { id: 'mapa-crimes', label: 'Mapa de Crimes', icon: MapPin },
    { id: 'busca-avancada', label: 'Busca Avançada', icon: ScanFace },
    { id: 'correlacao', label: 'Correlação Criminal', icon: Network },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold">B.O. Digital</h2>
            <p className="text-xs text-gray-500">Polícia Nacional</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="text-sm">
          <div className="font-medium">{user?.nome}</div>
          <div className="text-gray-500">{user?.posto}</div>
          <div className="text-xs text-gray-400">Mat: {user?.matricula}</div>
          {user?.distrito && (
            <div className="text-xs text-gray-400">
              <MapPin className="h-3 w-3 inline mr-1" />
              {user.distrito}
            </div>
          )}
        </div>
      </div>

      {/* Alertas */}
      {alertasAtivos > 0 && (
        <div className="p-4 border-b border-gray-200">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Alertas Ativos</span>
              <Badge variant="destructive" className="text-xs">
                {alertasAtivos}
              </Badge>
            </div>
            <p className="text-xs text-red-600 mt-1">
              Suspeitos procurados e padrões detectados
            </p>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="mr-3 h-4 w-4" />
                <span className="text-sm">{item.label}</span>
                
                {/* Badges especiais */}
                {item.id === 'mapa-crimes' && alertasAtivos > 0 && (
                  <Badge variant="destructive" className="ml-auto text-xs">
                    {alertasAtivos}
                  </Badge>
                )}
                
                {item.id === 'correlacao' && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    IA
                  </Badge>
                )}
                
                {item.id === 'busca-avancada' && (
                  <Badge variant="outline" className="ml-auto text-xs">
                    Facial
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Status do Sistema */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-600">Sistema Online</span>
          </div>
          <div className="text-xs text-gray-500">
            Conectado a 5 distritos • Tempo real
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span className="text-sm">Sair do Sistema</span>
        </Button>
      </div>
    </div>
  );
};