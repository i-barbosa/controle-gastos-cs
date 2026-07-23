import type{ Pessoa } from '../types';

export default function PessoaList({ pessoas, onDelete }: { 
  pessoas: Pessoa[]; 
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Pessoas Cadastradas</h2>
      </div>
      <div className="divide-y">
        {pessoas.map(p => (
          <div key={p.id} className="p-6 flex justify-between items-center hover:bg-gray-50">
            <div>
              <p className="font-medium text-lg">{p.nome}</p>
              <p className="text-gray-500">{p.idade} anos</p>
            </div>
            <button
              onClick={() => onDelete(p.id)}
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              Deletar
            </button>
          </div>
        ))}
        {pessoas.length === 0 && (
          <p className="p-8 text-center text-gray-400">Nenhuma pessoa cadastrada ainda.</p>
        )}
      </div>
    </div>
  );
}