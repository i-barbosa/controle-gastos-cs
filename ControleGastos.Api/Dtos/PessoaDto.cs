namespace ControleGastos.Api.Dtos;

public record PessoaRequest(string Nome, int Idade);

public record PessoaResponse(Guid Id, string Nome, int Idade);