import React from 'react';
import { AppRoute } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { APP_ASSETS } from '../data/mockData';

interface LandingScreenProps {
  onNavigate: (route: AppRoute) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate }) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto px-4 pt-12 pb-16 md:pt-20 md:pb-24 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
            <Badge variant="ai">✦ Google Gemini AI Powered</Badge>
            <Badge variant="primary">Contexto de Clima Real</Badge>
            <Badge variant="success">Revisão Humana Ativa</Badge>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f172a] tracking-tight leading-[1.15] mb-6">
            Planeje sua viagem perfeita em segundos com{' '}
            <span className="bg-gradient-to-r from-[#0b3c5d] to-[#ae3115] bg-clip-text text-transparent">
              Inteligência Artificial
            </span>
          </h1>

          <p className="text-base md:text-lg text-[#475569] leading-relaxed mb-8 max-w-xl">
            Diga adeus a horas perdidas em dezenas de guias e planilhas confusas. O SmartTrip cruza
            suas folgas reais, clima do destino e preferências para criar roteiros otimizados que
            você revisa e personaliza.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <Button
              variant="gradient"
              size="lg"
              onClick={() => onNavigate('/register')}
              className="w-full sm:w-auto"
            >
              Começar Grátis Agora
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate('/login')}
              className="w-full sm:w-auto"
            >
              Já tenho uma conta
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center md:justify-start gap-4 text-xs text-[#64748b]">
            <span className="flex items-center gap-1">✓ Sem cartão de crédito</span>
            <span className="flex items-center gap-1">✓ Roteiro em JSON Estruturado</span>
            <span className="flex items-center gap-1">✓ 100% Customizável</span>
          </div>
        </div>

        {/* Hero Interactive Preview Card */}
        <div className="flex-1 w-full max-w-md">
          <Card variant="elevated" className="overflow-hidden border-2 border-[#cbd5e1]/60 p-0 shadow-2xl">
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={APP_ASSETS.heroLanding}
                alt="Destino de Viagem"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                <div>
                  <Badge variant="primary" className="bg-white/90 text-[#0b3c5d] font-bold mb-1">
                    Exemplo de Roteiro Gerado
                  </Badge>
                  <h3 className="text-xl font-bold text-white">Lisboa, Portugal</h3>
                  <p className="text-xs text-white/90">5 Dias • Clima: 22°C Ensolarado • Ritmo Moderado</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-3 bg-white">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-[#0b3c5d] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  09h
                </span>
                <div>
                  <h4 className="text-xs font-bold text-[#0f172a]">Mosteiro dos Jerónimos & Belém</h4>
                  <p className="text-[11px] text-[#64748b] mt-0.5">Visita cultural com ingresso antecipado sem filas.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-[#ae3115] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  13h
                </span>
                <div>
                  <h4 className="text-xs font-bold text-[#0f172a]">Pastéis de Belém Tradicionais</h4>
                  <p className="text-[11px] text-[#64748b] mt-0.5">Dica da IA: peça no balcão interno para não esperar na calçada.</p>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="text-[#10b981] font-semibold">✓ Curadoria Humana Habilitada</span>
                <button
                  onClick={() => onNavigate('/register')}
                  className="text-[#0b3c5d] font-bold hover:underline"
                >
                  Experimentar →
                </button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 3 Step Process Section */}
      <section className="w-full bg-white border-y border-slate-200 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Badge variant="neutral" className="mb-2">Como Funciona</Badge>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Três passos para o seu roteiro perfeito
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto mb-12 text-sm md:text-base">
            O SmartTrip combina modelos de raciocínio da Google com dados de clima e atrativos locais.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <Card variant="bordered" className="p-6">
              <div className="w-10 h-10 rounded-xl bg-[#0b3c5d]/10 text-[#0b3c5d] font-bold text-lg flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Cadastre suas Folgas</h3>
              <p className="text-slate-600 text-xs md:text-sm">
                Informe quando você pode viajar. Feriados, férias de 5 dias ou um fim de semana rápido.
              </p>
            </Card>

            <Card variant="bordered" className="p-6">
              <div className="w-10 h-10 rounded-xl bg-[#ae3115]/10 text-[#ae3115] font-bold text-lg flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Escolha o Destino</h3>
              <p className="text-slate-600 text-xs md:text-sm">
                A aplicação consulta coordenadas, previsão do clima e atrativos de destaque para o seu período.
              </p>
            </Card>

            <Card variant="bordered" className="p-6">
              <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 text-[#10b981] font-bold text-lg flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Revise & Personalize</h3>
              <p className="text-slate-600 text-xs md:text-sm">
                A IA gera o roteiro dia a dia em JSON. Você edita, exclui o que não quiser e salva na sua conta.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>
          <span className="font-bold text-slate-700">SmartTrip</span> © 2026 — Projeto Final de IA Generativa.
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('/login')} className="hover:text-slate-900">Entrar</button>
          <button onClick={() => onNavigate('/register')} className="hover:text-slate-900">Cadastrar</button>
          <span>Desenvolvido com Google Gemini & Next.js/React</span>
        </div>
      </footer>
    </div>
  );
};
