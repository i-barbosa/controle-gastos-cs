// Representa uma pessoa cadastrada no sistema.
export interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

// Representa uma transação financeira.
export interface Transacao {
  id: string;
  pessoaId: string;
  descricao: string;
  valor: number;

  // 0 = Despesa | 1 = Receita
  tipo: number;

  pessoaNome?: string;

  // Data da transação no formato ISO.
  dataCriacao: string;
}

// Dados utilizados para cadastrar uma nova pessoa.
export interface CriarPessoaDTO {
  nome: string;
  idade: number;
}

// Dados utilizados para cadastrar uma nova transação.
export interface CriarTransacaoDTO {
  pessoaId: string;
  descricao: string;
  valor: number;
  tipo: number;
}

// Representa o resumo financeiro de uma pessoa.
export interface PessoaTotais {
  pessoaId: string;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

// Representa o resumo financeiro geral retornado pela API.
export interface TotaisResponse {
  totalReceitas: number;
  totalDespesas: number;
  saldoGeral: number;
  pessoas: PessoaTotais[];
}