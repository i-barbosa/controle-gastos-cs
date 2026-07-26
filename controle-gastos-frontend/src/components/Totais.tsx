import type { TotaisResponse } from '../types';
import type { Transacao } from '../types';

// Componente responsável por exibir um gráfico de barras
// comparando receitas e despesas por mês.
function BarChart({
  data,
}: {
  data: { label: string; receitas: number; despesas: number }[];
}) {
  // Obtém o maior valor para definir a escala do gráfico.
  const max = Math.max(...data.flatMap((d) => [d.receitas, d.despesas]), 1);

  // Define as dimensões do gráfico.
  const H = 140;
  const barW = 18;
  const gap = 8;
  const groupW = barW * 2 + gap + 24;
  const w = data.length * groupW + 24;

  return (
    <svg viewBox={`0 0 ${w} ${H + 30}`} className="w-full" style={{ maxHeight: 180 }}>
      {data.map((d, i) => {
        const x = 12 + i * groupW;
        const hR = (d.receitas / max) * H;
        const hD = (d.despesas / max) * H;

        return (
          <g key={d.label}>
            <rect
              x={x}
              y={H - hR}
              width={barW}
              height={hR}
              rx={3}
              fill="#10b981"
              opacity={0.85}
            />

            <rect
              x={x + barW + gap}
              y={H - hD}
              width={barW}
              height={hD}
              rx={3}
              fill="#ef4444"
              opacity={0.85}
            />

            <text
              x={x + barW + gap / 2}
              y={H + 18}
              textAnchor="middle"
              fontSize={9}
              fill="#6b7280"
            >
              {d.label}
            </text>
          </g>
        );
      })}

      <line x1={0} y1={H} x2={w} y2={H} stroke="#e5e7eb" strokeWidth={1} />
    </svg>
  );
}

// Componente responsável por exibir um gráfico em formato
// de donut com a distribuição entre receitas e despesas.
function DonutChart({
  receitas,
  despesas,
}: {
  receitas: number;
  despesas: number;
}) {
  // Calcula o total para obter a proporção de cada categoria.
  const total = receitas + despesas || 1;

  const r = 50;
  const cx = 70;
  const cy = 70;
  const circ = 2 * Math.PI * r;

  const recFrac = receitas / total;
  const despFrac = despesas / total;

  // Desenha um segmento do gráfico.
  const arc = (frac: number, offset: number, color: string) => (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill="none"
      stroke={color}
      strokeWidth={22}
      strokeDasharray={`${frac * circ} ${circ}`}
      strokeDashoffset={-offset * circ}
      transform={`rotate(-90 ${cx} ${cy})`}
    />
  );

  return (
    <svg viewBox="0 0 140 140" className="w-32 h-32">
      {arc(recFrac, 0, '#10b981')}
      {arc(despFrac, recFrac, '#ef4444')}

      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        fontSize={9}
        fill="#6b7280"
      >
        Saldo
      </text>

      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        fontSize={11}
        fontWeight="bold"
        fill={receitas - despesas >= 0 ? '#059669' : '#dc2626'}
      >
        R${(receitas - despesas).toFixed(0)}
      </text>
    </svg>
  );
}

interface Props {
  totais: TotaisResponse;
  transacoes: Transacao[];
}

// Converte a data da transação para o formato "AAAA-MM",
// utilizado para agrupar os dados por mês.
function getMonthKey(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// Componente responsável por exibir o resumo financeiro,
// incluindo gráficos e totais do sistema.
export default function Totais({ totais, transacoes }: Props) {
  // Agrupa as transações por mês para montar o gráfico de barras.
  const monthlyData = (() => {
    // Armazena os totais de cada mês.
    const map: Record<string, { receitas: number; despesas: number }> = {};

    transacoes.forEach((t) => {
      // Obtém o mês correspondente à transação.
      const k = getMonthKey(t.dataCriacao);

      // Cria o mês caso ele ainda não exista.
      if (!map[k]) {
        map[k] = {
          receitas: 0,
          despesas: 0,
        };
      }

      // Soma o valor conforme o tipo da transação.
      if (t.tipo === 1) {
        map[k].receitas += t.valor;
      } else {
        map[k].despesas += t.valor;
      }
    });

    // Ordena os meses, mantém os seis mais recentes
    // e prepara os dados para o gráfico.
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([k, v]) => {
        const [, m] = k.split('-');

        const label = new Date(
          Number(k.split('-')[0]),
          Number(m) - 1,
          1
        ).toLocaleDateString('pt-BR', {
          month: 'short',
        });

        return {
          label,
          ...v,
        };
      });
  })();

  // Cards gerais.
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border text-center">
          <p className="text-emerald-600 text-3xl font-bold">
            R$ {totais.totalReceitas.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              })}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Total Receitas
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border text-center">
          <p className="text-red-600 text-3xl font-bold">
            R$ {totais.totalDespesas.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              })}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Total Despesas
          </p>
        </div>

        <div
          className={`p-6 rounded-2xl shadow-sm border text-center ${
            totais.saldoGeral >= 0
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <p
            className={`text-3xl font-bold ${
              totais.saldoGeral >= 0
                ? 'text-emerald-600'
                : 'text-red-600'
            }`}
          >
            R$ {totais.saldoGeral.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              })}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Saldo Geral
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="font-semibold mb-4 text-gray-700">
            Receitas × Despesas por Mês
          </h3>

          {monthlyData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              Sem dados
            </p>
          ) : (
            <>
              <BarChart data={monthlyData} />

              <div className="flex gap-4 mt-2 justify-center text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
                  Receitas
                </span>

                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-red-500 inline-block" />
                  Despesas
                </span>
              </div>
            </>
          )}
        </div>

        {/* Gráfico de donut */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col items-center justify-center">
          <h3 className="font-semibold mb-4 text-gray-700 self-start">
            Distribuição Geral
          </h3>

          <DonutChart
            receitas={totais.totalReceitas}
            despesas={totais.totalDespesas}
          />

          <div className="flex gap-6 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              Receitas
            </span>

            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
              Despesas
            </span>
          </div>
        </div>
      </div>

      {/* Tabela com o resumo financeiro de cada pessoa */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b bg-gray-50">
          <h2 className="text-xl font-semibold">
            Resumo por Pessoa
          </h2>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-6 font-medium">Pessoa</th>
              <th className="text-right p-6 font-medium">Receitas</th>
              <th className="text-right p-6 font-medium">Despesas</th>
              <th className="text-right p-6 font-medium">Saldo</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {totais.pessoas.map((p) => (
              <tr key={p.pessoaId}>
                <td className="p-6 font-medium">{p.nome}</td>

                <td className="p-6 text-right text-emerald-600">
                  R$ {p.totalReceitas.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                    })}
                </td>

                <td className="p-6 text-right text-red-600">
                  R$ {p.totalDespesas.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  })}
                </td>

                <td
                  className={`p-6 text-right font-semibold ${
                    p.saldo >= 0
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }`}
                >
                  R$ {p.saldo.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}