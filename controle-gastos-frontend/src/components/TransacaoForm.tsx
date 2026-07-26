import { useState, useEffect } from 'react';
import { api } from '../api/api';
import type { CriarTransacaoDTO, Pessoa } from '../types';

// Formulário responsável pelo cadastro de novas transações.
export default function TransacaoForm({
  pessoas,
  onCreated
}: {
  pessoas: Pessoa[];
  onCreated: () => void;
}) {
  // Armazena os dados preenchidos no formulário.
  const [form, setForm] = useState<CriarTransacaoDTO>({
    pessoaId: '',
    descricao: '',
    valor: 0,
    tipo: 0
  });

  // Obtém a pessoa atualmente selecionada.
  const pessoaSelecionada = pessoas.find(p => p.id === form.pessoaId);

  // Sempre que uma pessoa menor de idade for selecionada,
  // define automaticamente o tipo como despesa.
  useEffect(() => {
    if (pessoaSelecionada?.idade && pessoaSelecionada.idade < 18) {
      setForm(prev => ({ ...prev, tipo: 0 }));
    }
  }, [pessoaSelecionada]);

  // Envia os dados da transação para a API.
  const handleSubmit = async (e: React.FormEvent) => {
    // Impede o recarregamento da página ao enviar o formulário.
    e.preventDefault();

    try {
      // Cadastra a transação.
      await api.createTransacao(form);

      // Limpa os campos do formulário.
      setForm({
        pessoaId: '',
        descricao: '',
        valor: 0,
        tipo: 0
      });

      // Atualiza os dados exibidos na tela.
      onCreated();
    } catch (error: any) {
      // Exibe a mensagem de erro retornada pela API.
      alert(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-sm border space-y-5"
    >
      <h2 className="text-2xl font-semibold">Nova Transação</h2>

      <select
        value={form.pessoaId}
        onChange={e => setForm({ ...form, pessoaId: e.target.value })}
        className="w-full px-4 py-3 border rounded-xl"
        required
      >
        <option value="">Selecione uma pessoa</option>

        {/* Exibe todas as pessoas cadastradas. */}
        {pessoas.map(p => (
          <option key={p.id} value={p.id}>
            {p.nome} ({p.idade} anos)
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Descrição da transação"
        value={form.descricao}
        onChange={e => setForm({ ...form, descricao: e.target.value })}
        className="w-full px-4 py-3 border rounded-xl"
        required
      />

      <input
        type="number"
        step="0.01"
        placeholder="Valor"
        value={form.valor || ''}
        onChange={e => setForm({ ...form, valor: parseFloat(e.target.value) })}
        className="w-full px-4 py-3 border rounded-xl"
        required
      />

      <select
        value={form.tipo}
        onChange={e => setForm({ ...form, tipo: Number(e.target.value) })}
        disabled={pessoaSelecionada && pessoaSelecionada.idade < 18}
        className="w-full px-4 py-3 border rounded-xl"
      >
        <option value={0}>Despesa</option>

        {/* Menores de idade não podem registrar receitas. */}
        <option
          value={1}
          disabled={pessoaSelecionada && pessoaSelecionada.idade < 18}
        >
          Receita
        </option>
      </select>

      <button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3.5 rounded-xl transition"
      >
        Registrar Transação
      </button>
    </form>
  );
}