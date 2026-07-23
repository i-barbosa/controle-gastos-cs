import type { Transacao } from '../types';

export default function TransacaoList({ transacoes }: { transacoes: Transacao[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Últimas Transações</h2>
      </div>
      <div className="divide-y max-h-[600px] overflow-auto">
        {transacoes.map(t => (
          <div key={t.id} className="p-6 flex justify-between items-center">
            <div>
              <p className="font-medium">{t.descricao}</p>
              <p className="text-sm text-gray-500">{t.pessoaNome}</p>
            </div>
            <div className={`font-semibold ${t.tipo === 1 ? 'text-emerald-600' : 'text-red-600'}`}>
              {t.tipo === 1 ? '+' : '-'} R$ {t.valor.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}