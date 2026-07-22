namespace ControleGastos.Api.Dtos;

public record TransacaoRequest(Guid PessoaId, string Descricao, decimal Valor, int Tipo);

public record TransacaoResponse(Guid Id, Guid PessoaId, string Descricao, decimal Valor, int Tipo, string PessoaNome);