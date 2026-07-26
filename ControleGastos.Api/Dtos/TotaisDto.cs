namespace ControleGastos.Api.Dtos;

// Representa os totais financeiros de uma pessoa.
public record PessoaTotaisDto(
    Guid PessoaId,
    string Nome,
    decimal TotalReceitas,
    decimal TotalDespesas,
    decimal Saldo);

// Representa o resumo financeiro geral do sistema.
public record TotaisGeraisDto(
    decimal TotalReceitas,
    decimal TotalDespesas,
    decimal SaldoGeral,
    List<PessoaTotaisDto> Pessoas);