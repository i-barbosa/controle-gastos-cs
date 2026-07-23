export interface Pessoa {
  id: string;
  nome: string;
  idade: number;
}

export interface Transacao {
  id: string;
  pessoaId: string;
  descricao: string;
  valor: number;
  tipo: number; // 0 = Despesa | 1 = Receita
  pessoaNome?: string;
}

export interface CriarPessoaDTO {
  nome: string;
  idade: number;
}

export interface CriarTransacaoDTO {
  pessoaId: string;
  descricao: string;
  valor: number;
  tipo: number;
}

export interface PessoaTotais {
  pessoaId: string;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotaisResponse {
  totalReceitas: number;
  totalDespesas: number;
  saldoGeral: number;
  pessoas: PessoaTotais[];
}