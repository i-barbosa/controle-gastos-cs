namespace ControleGastos.Api.Dtos;

// Dados recebidos para cadastrar uma nova transação.
public record TransacaoRequest(
    Guid PessoaId,
    string Descricao,
    decimal Valor,
    int Tipo);

// Dados retornados pela API ao consultar uma transação.
public record TransacaoResponse(
    Guid Id,
    Guid PessoaId,
    string Descricao,
    decimal Valor,
    int Tipo,
    string PessoaNome,
    DateTime DataCriacao);