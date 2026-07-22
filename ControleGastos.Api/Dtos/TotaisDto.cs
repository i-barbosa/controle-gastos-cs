namespace ControleGastos.Api.Dtos;

public record PessoaTotaisDto(
    Guid PessoaId,
    string Nome,
    decimal TotalReceitas,
    decimal TotalDespesas,
    decimal Saldo);

public record TotaisGeraisDto(
    decimal TotalReceitas,
    decimal TotalDespesas,
    decimal SaldoGeral,
    List<PessoaTotaisDto> Pessoas);