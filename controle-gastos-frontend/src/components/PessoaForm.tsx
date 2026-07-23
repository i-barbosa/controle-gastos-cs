import { useState } from 'react';
import { api } from '../api/api';
import type { CriarPessoaDTO } from '../types';

export default function PessoaForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState<CriarPessoaDTO>({ nome: '', idade: 0 });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createPessoa(form);
      setForm({ nome: '', idade: 0 });
      onCreated();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border">
      <h2 className="text-2xl font-semibold mb-5">Cadastrar Pessoa</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Nome da pessoa"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="number"
          placeholder="Idade"
          value={form.idade || ''}
          onChange={(e) => setForm({ ...form, idade: Number(e.target.value) })}
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="0"
          max="120"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-xl transition disabled:opacity-70"
        >
          {loading ? 'Cadastrando...' : 'Cadastrar Pessoa'}
        </button>
      </div>
    </form>
  );
}