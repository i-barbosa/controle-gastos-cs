namespace ControleGastos.Api.Dtos;

// Dados recebidos para cadastrar uma nova pessoa.
public record PessoaRequest(string Nome, int Idade);

// Dados retornados pela API após consultar uma pessoa.
public record PessoaResponse(Guid Id, string Nome, int Idade);