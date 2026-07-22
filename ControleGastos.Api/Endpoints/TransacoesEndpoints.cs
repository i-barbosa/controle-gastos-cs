using ControleGastos.Api.Data;
using ControleGastos.Api.Dtos;
using ControleGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Endpoints;

public static class TransacoesEndpoints
{
    public static void MapTransacoesEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/transacoes").WithTags("Transações");

        // POST /api/transacoes
        group.MapPost("", async (TransacaoRequest request, AppDbContext db) =>
        {
            var pessoa = await db.Pessoas.FindAsync(request.PessoaId);
            if (pessoa is null) return Results.NotFound("Pessoa não encontrada.");

            // Regra de negócio: Menores de 18 não podem ter Receita
            if (pessoa.Idade < 18 && request.Tipo == 1)
                return Results.BadRequest("Menores de 18 anos não podem registrar receitas.");

            var transacao = new Transacao
            {
                Descricao = request.Descricao,
                Valor = request.Valor,
                Tipo = request.Tipo,
                PessoaId = request.PessoaId
            };

            db.Transacoes.Add(transacao);
            await db.SaveChangesAsync();

            return Results.Created($"/api/transacoes/{transacao.Id}",
                new TransacaoResponse(transacao.Id, transacao.PessoaId, transacao.Descricao, 
                                    transacao.Valor, transacao.Tipo, pessoa.Nome));
        })
        .WithSummary("Cria transação (com validação de idade para receita)");

        // GET /api/transacoes
        group.MapGet("", async (AppDbContext db) =>
            await db.Transacoes
                .Include(t => t.Pessoa)
                .Select(t => new TransacaoResponse(t.Id, t.PessoaId, t.Descricao, t.Valor, t.Tipo, t.Pessoa.Nome))
                .ToListAsync())
        .WithSummary("Lista todas as transações");
    }
}