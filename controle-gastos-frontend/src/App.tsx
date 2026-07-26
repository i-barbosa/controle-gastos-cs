import { useState, useEffect } from 'react';
import { Home, Users, ArrowRightLeft, PieChart } from 'lucide-react';

import PessoaForm from './components/PessoaForm';
import PessoaList from './components/PessoaList';
import TransacaoForm from './components/TransacaoForm';
import TransacaoList from './components/TransacaoList';
import Totais from './components/Totais';

import { api } from './api/api';
import type { Pessoa, Transacao, TotaisResponse } from './types';

function App() {

  // Controla a aba atualmente exibida.
  const [tab, setTab] = useState<'pessoas' | 'transacoes' | 'totais'>('pessoas');

  // Armazena os dados carregados da API.
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [totais, setTotais] = useState<TotaisResponse | null>(null);

  // Carrega todos os dados necessários para a aplicação.
  const loadAll = async () => {
    try {

      // Executa todas as requisições em paralelo para melhorar o desempenho.
      const [p, t, tot] = await Promise.all([
        api.getPessoas(),
        api.getTransacoes(),
        api.getTotais(),
      ]);

      // Atualiza os estados da aplicação.
      setPessoas(p);
      setTransacoes(t);
      setTotais(tot);

    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  };

  // Carrega os dados quando a aplicação é iniciada.
  useEffect(() => {
    loadAll();
  }, []);

  // Remove uma pessoa após a confirmação do usuário.
  const handleDeletePessoa = async (id: string) => {

    if (!confirm('Deletar esta pessoa e todas as suas transações?'))
      return;

    try {
      await api.deletePessoa(id);

      // Atualiza os dados da tela após a exclusão.
      loadAll();

    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Cabeçalho da aplicação */}
        <header className="flex items-center justify-center gap-3 mb-10">
          <Home className="w-8 h-8 text-slate-800" />
          <h1 className="text-3xl font-bold text-slate-800">
            Controle de Gastos Residenciais
          </h1>
        </header>

        {/* Navegação entre as telas */}
        <nav className="flex justify-center mb-10">
          <div className="bg-white rounded-xl border border-gray-200 p-1 flex gap-1 shadow-sm">
            {(['pessoas', 'transacoes', 'totais'] as const).map((t, i) => {

              const icons = [
                <Users className="w-4 h-4" />,
                <ArrowRightLeft className="w-4 h-4" />,
                <PieChart className="w-4 h-4" />
              ];

              const labels = [
                'Pessoas',
                'Transações',
                'Totais'
              ];

              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                    tab === t
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {icons[i]}
                  {labels[i]}
                </button>
              );
            })}
          </div>
        </nav>

        <main>

          {/* Exibe a tela de totais */}
          {tab === 'totais' ? (
            <div className="max-w-4xl mx-auto w-full">
              {totais && (
                <Totais
                  totais={totais}
                  transacoes={transacoes}
                />
              )}
            </div>
          ) : (

            // Exibe os formulários e listas de pessoas ou transações.
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              <section className="lg:col-span-5 space-y-8">
                {tab === 'pessoas' && (
                  <PessoaForm onCreated={loadAll} />
                )}

                {tab === 'transacoes' && (
                  <TransacaoForm
                    pessoas={pessoas}
                    onCreated={loadAll}
                  />
                )}
              </section>

              <section className="lg:col-span-7 space-y-8">
                {tab === 'pessoas' && (
                  <PessoaList
                    pessoas={pessoas}
                    onDelete={handleDeletePessoa}
                  />
                )}

                {tab === 'transacoes' && (
                  <TransacaoList transacoes={transacoes} />
                )}
              </section>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default App;