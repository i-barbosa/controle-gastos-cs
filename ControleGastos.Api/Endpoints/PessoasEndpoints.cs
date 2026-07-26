using ControleGastos.Api.Data;
using ControleGastos.Api.Dtos;
using ControleGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Endpoints;

// Responsável pelos endpoints relacionados ao gerenciamento de pessoas.
public static class PessoasEndpoints
{
    public static void MapPessoasEndpoints(this IEndpointRouteBuilder app)
    {
        // Agrupa todos os endpoints de pessoas na rota "/api/pessoas".
        var group = app.MapGroup("/api/pessoas").WithTags("Pessoas");

        // Cadastra uma nova pessoa.
        group.MapPost("", async (PessoaRequest request, AppDbContext db) =>
        {
            // Cria uma nova instância da pessoa com os dados recebidos.
            var pessoa = new Pessoa
            {
                Nome = request.Nome,
                Idade = request.Idade
            };

            // Adiciona a pessoa ao banco de dados.
            db.Pessoas.Add(pessoa);

            // Salva as alterações.
            await db.SaveChangesAsync();

            // Retorna HTTP 201 com os dados da pessoa criada.
            return Results.Created(
                $"/api/pessoas/{pessoa.Id}",
                new PessoaResponse(pessoa.Id, pessoa.Nome, pessoa.Idade));
        })
        .WithSummary("Cria uma nova pessoa");

        // Lista todas as pessoas cadastradas.
        group.MapGet("", async (AppDbContext db) =>
            await db.Pessoas

                // Converte a entidade para o DTO de resposta.
                .Select(p => new PessoaResponse(
                    p.Id,
                    p.Nome,
                    p.Idade))

                // Retorna a lista de pessoas.
                .ToListAsync())
        .WithSummary("Lista todas as pessoas");

        // Remove uma pessoa pelo identificador.
        group.MapDelete("{id:guid}", async (Guid id, AppDbContext db) =>
        {
            // Procura a pessoa no banco de dados.
            var pessoa = await db.Pessoas.FindAsync(id);

            // Retorna 404 caso a pessoa não seja encontrada.
            if (pessoa is null)
                return Results.NotFound();

            // Remove a pessoa.
            // As transações também serão removidas devido ao Cascade Delete.
            db.Pessoas.Remove(pessoa);

            // Salva as alterações.
            await db.SaveChangesAsync();

            // Retorna sucesso sem conteúdo.
            return Results.NoContent();
        })
        .WithSummary("Deleta pessoa e suas transações");
    }
}