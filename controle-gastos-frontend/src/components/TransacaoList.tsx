import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Transacao } from '../types';

// Converte uma data para o formato "AAAA-MM",
// utilizado para agrupar as transações por mês.
function getMonthKey(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// Converte a chave do mês para um formato mais amigável.
function formatMonthLabel(key: string) {
  const [year, month] = key.split('-');
  const d = new Date(Number(year), Number(month) - 1, 1);

  return d.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });
}

// Componente responsável por exibir a lista de transações,
// permitindo navegar entre os meses cadastrados.
export default function TransacaoList({
  transacoes
}: {
  transacoes: Transacao[];
}) {

  // Obtém todos os meses existentes nas transações,
  // ordenando do mais recente para o mais antigo.
  const months = useMemo(() => {
    const keys = Array.from(
      new Set(transacoes.map(t => getMonthKey(t.dataCriacao))
    ));

    return keys.sort().reverse();
  }, [transacoes]);

  // Obtém o mês atual.
  const currentMonthKey = getMonthKey(new Date().toISOString());

  // Define o mês inicialmente selecionado.
  const [selectedMonth, setSelectedMonth] = useState<string>(
    months.includes(currentMonthKey)
      ? currentMonthKey
      : (months[0] ?? currentMonthKey)
  );

  // Obtém a posição do mês selecionado.
  const idx = months.indexOf(selectedMonth);

  // Filtra apenas as transações do mês selecionado.
  const filtered = transacoes.filter(
    t => getMonthKey(t.dataCriacao) === selectedMonth
  );

  // Navega para o mês anterior.
  const prev = () => {
    if (idx < months.length - 1) {
      setSelectedMonth(months[idx + 1]);
    }
  };

  // Navega para o próximo mês.
  const next = () => {
    if (idx > 0) {
      setSelectedMonth(months[idx - 1]);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border">

      {/* Cabeçalho com navegação entre os meses */}
      <div className="p-6 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold">Transações</h2>

        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            disabled={idx >= months.length - 1}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-sm font-medium w-36 text-center capitalize">
            {months.length > 0
              ? formatMonthLabel(selectedMonth)
              : 'Sem transações'}
          </span>

          <button
            onClick={next}
            disabled={idx <= 0}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Exibe o resumo financeiro do mês selecionado */}
      {filtered.length > 0 && (() => {

        // Soma todas as receitas do mês.
        const rec = filtered
          .filter(t => t.tipo === 1)
          .reduce((s, t) => s + t.valor, 0);

        // Soma todas as despesas do mês.
        const desp = filtered
          .filter(t => t.tipo === 0)
          .reduce((s, t) => s + t.valor, 0);

        return (
          <div className="px-6 py-3 bg-gray-50 border-b flex gap-6 text-sm">
            <span className="text-emerald-600 font-medium">
              +R$ {rec.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>

            <span className="text-red-600 font-medium">
              -R$ {desp.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>

            <span
              className={`font-semibold ${
                rec - desp >= 0
                  ? 'text-emerald-700'
                  : 'text-red-700'
              }`}
            >
              Saldo: R$ {(rec - desp).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        );
      })()}

      {/* Lista das transações do mês selecionado */}
      <div className="divide-y max-h-[500px] overflow-auto">
        {filtered.length === 0 ? (
          <p className="p-8 text-center text-gray-400 text-sm">
            Nenhuma transação neste mês
          </p>
        ) : (

          // Percorre todas as transações do mês selecionado.
          filtered.map(t => (
            <div
              key={t.id}
              className="p-5 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{t.descricao}</p>

                <p className="text-sm text-gray-500">
                  {t.pessoaNome} · {new Date(t.dataCriacao).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <div
                className={`font-semibold ${
                  t.tipo === 1
                    ? 'text-emerald-600'
                    : 'text-red-600'
                }`}
              >
                {t.tipo === 1 ? '+' : '-'} R$ {t.valor.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}