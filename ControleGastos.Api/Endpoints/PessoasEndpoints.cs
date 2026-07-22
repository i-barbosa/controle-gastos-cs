using ControleGastos.Api.Data;
using ControleGastos.Api.Dtos;
using ControleGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Endpoints;

public static class PessoasEndpoints
{
    public static void MapPessoasEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/pessoas").WithTags("Pessoas");

        // POST /api/pessoas
        group.MapPost("", async (PessoaRequest request, AppDbContext db) =>
        {
            var pessoa = new Pessoa { Nome = request.Nome, Idade = request.Idade };
            db.Pessoas.Add(pessoa);
            await db.SaveChangesAsync();
            return Results.Created($"/api/pessoas/{pessoa.Id}", new PessoaResponse(pessoa.Id, pessoa.Nome, pessoa.Idade));
        })
        .WithSummary("Cria uma nova pessoa");

        // GET /api/pessoas
        group.MapGet("", async (AppDbContext db) =>
            await db.Pessoas
                .Select(p => new PessoaResponse(p.Id, p.Nome, p.Idade))
                .ToListAsync())
        .WithSummary("Lista todas as pessoas");

        // DELETE /api/pessoas/{id}
        group.MapDelete("{id:guid}", async (Guid id, AppDbContext db) =>
        {
            var pessoa = await db.Pessoas.FindAsync(id);
            if (pessoa is null) return Results.NotFound();

            db.Pessoas.Remove(pessoa); // Transações serão deletadas em cascata
            await db.SaveChangesAsync();
            return Results.NoContent();
        })
        .WithSummary("Deleta pessoa e suas transações");
    }
}