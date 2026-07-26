import type { Pessoa, Transacao, CriarPessoaDTO, CriarTransacaoDTO, TotaisResponse } from '../types';

// URL utilizada para realizar as requisições para a API.
// Caso a variável de ambiente não exista, utiliza o endereço local.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5062';

// Centraliza todas as chamadas para a API.
export const api = {

  // Busca todas as pessoas cadastradas.
  async getPessoas(): Promise<Pessoa[]> {
    const res = await fetch(`${API_URL}/api/pessoas`);

    if (!res.ok)
      throw new Error('Erro ao buscar pessoas');

    return res.json();
  },

  // Cadastra uma nova pessoa.
  async createPessoa(data: CriarPessoaDTO): Promise<Pessoa> {
    const res = await fetch(`${API_URL}/api/pessoas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok)
      throw new Error('Erro ao criar pessoa');

    return res.json();
  },

  // Remove uma pessoa pelo identificador.
  async deletePessoa(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/pessoas/${id}`, {
      method: 'DELETE'
    });

    if (!res.ok)
      throw new Error('Erro ao deletar pessoa');
  },

  // Busca todas as transações cadastradas.
  async getTransacoes(): Promise<Transacao[]> {
    const res = await fetch(`${API_URL}/api/transacoes`);

    if (!res.ok)
      throw new Error('Erro ao buscar transações');

    return res.json();
  },

  // Cadastra uma nova transação.
  async createTransacao(data: CriarTransacaoDTO): Promise<Transacao> {
    const res = await fetch(`${API_URL}/api/transacoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    // Retorna a mensagem enviada pela API caso ocorra algum erro.
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Erro ao criar transação');
    }

    return res.json();
  },

  // Busca os totais gerais e por pessoa.
  async getTotais(): Promise<TotaisResponse> {
    const res = await fetch(`${API_URL}/api/totais`);

    if (!res.ok)
      throw new Error('Erro ao buscar totais');

    return res.json();
  },
};