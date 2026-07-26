import type { Pessoa } from '../types';

// Componente responsável por exibir a lista de pessoas cadastradas.
export default function PessoaList({
  pessoas,
  onDelete,
}: {
  pessoas: Pessoa[];
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Pessoas Cadastradas</h2>
      </div>

      <div className="divide-y">
        {/* Percorre a lista de pessoas e exibe cada cadastro. */}
        {pessoas.map((p) => (
          <div
            key={p.id}
            className="p-6 flex justify-between items-center hover:bg-gray-50"
          >
            <div>
              <p className="font-medium text-lg">{p.nome}</p>
              <p className="text-gray-500">{p.idade} anos</p>
            </div>

            {/* Solicita a exclusão da pessoa selecionada. */}
            <button
              onClick={() => onDelete(p.id)}
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              Deletar
            </button>
          </div>
        ))}

        {/* Exibe uma mensagem quando não houver pessoas cadastradas. */}
        {pessoas.length === 0 && (
          <p className="p-8 text-center text-gray-400">
            Nenhuma pessoa cadastrada ainda.
          </p>
        )}
      </div>
    </div>
  );
}