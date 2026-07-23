import type { TotaisResponse } from '../types';
export default function Totais({ totais }: { totais: TotaisResponse }) {
  return (
    <div className="space-y-8">
      {/* Totais Gerais */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border text-center">
          <p className="text-emerald-600 text-3xl font-bold">R$ {totais.totalReceitas.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">Total Receitas</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border text-center">
          <p className="text-red-600 text-3xl font-bold">R$ {totais.totalDespesas.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">Total Despesas</p>
        </div>
        <div className={`p-6 rounded-2xl shadow-sm border text-center ${totais.saldoGeral >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
          <p className={`text-3xl font-bold ${totais.saldoGeral >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            R$ {totais.saldoGeral.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Saldo Geral</p>
        </div>
      </div>

      {/* Tabela por Pessoa */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b bg-gray-50">
          <h2 className="text-xl font-semibold">Resumo por Pessoa</h2>
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
            {totais.pessoas.map(p => (
              <tr key={p.pessoaId}>
                <td className="p-6 font-medium">{p.nome}</td>
                <td className="p-6 text-right text-emerald-600">R$ {p.totalReceitas.toFixed(2)}</td>
                <td className="p-6 text-right text-red-600">R$ {p.totalDespesas.toFixed(2)}</td>
                <td className={`p-6 text-right font-semibold ${p.saldo >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  R$ {p.saldo.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}