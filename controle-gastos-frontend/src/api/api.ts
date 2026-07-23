import type { Pessoa, Transacao, CriarPessoaDTO, CriarTransacaoDTO, TotaisResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5150';

export const api = {
  // Pessoas
  async getPessoas(): Promise<Pessoa[]> {
    const res = await fetch(`${API_URL}/api/pessoas`);
    if (!res.ok) throw new Error('Erro ao buscar pessoas');
    return res.json();
  },

  async createPessoa(data: CriarPessoaDTO): Promise<Pessoa> {
    const res = await fetch(`${API_URL}/api/pessoas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erro ao criar pessoa');
    return res.json();
  },

  async deletePessoa(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/pessoas/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao deletar pessoa');
  },

  // Transações
  async getTransacoes(): Promise<Transacao[]> {
    const res = await fetch(`${API_URL}/api/transacoes`);
    if (!res.ok) throw new Error('Erro ao buscar transações');
    return res.json();
  },

  async createTransacao(data: CriarTransacaoDTO): Promise<Transacao> {
    const res = await fetch(`${API_URL}/api/transacoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Erro ao criar transação');
    }
    return res.json();
  },

  // Totais
  async getTotais(): Promise<TotaisResponse> {
    const res = await fetch(`${API_URL}/api/totais`);
    if (!res.ok) throw new Error('Erro ao buscar totais');
    return res.json();
  },
};