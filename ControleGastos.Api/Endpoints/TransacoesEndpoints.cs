using ControleGastos.Api.Data;
using ControleGastos.Api.Dtos;
using ControleGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Endpoints;

// Responsável pelos endpoints relacionados às transações financeiras.
public static class TransacoesEndpoints
{
    public static void MapTransacoesEndpoints(this IEndpointRouteBuilder app)
    {
        // Agrupa todos os endpoints de transações na rota "/api/transacoes".
        var group = app.MapGroup("/api/transacoes").WithTags("Transações");

        // Cadastra uma nova transação.
        group.MapPost("", async (TransacaoRequest request, AppDbContext db) =>
        {
            // Verifica se a pessoa informada existe.
            var pessoa = await db.Pessoas.FindAsync(request.PessoaId);

            if (pessoa is null)
                return Results.NotFound("Pessoa não encontrada.");

            // Impede que menores de idade cadastrem receitas.
            if (pessoa.Idade < 18 && request.Tipo == 1)
                return Results.BadRequest("Menores de 18 anos não podem registrar receitas.");

            // Cria uma nova transação com os dados recebidos.
            var transacao = new Transacao
            {
                Descricao = request.Descricao,
                Valor = request.Valor,
                Tipo = request.Tipo,
                PessoaId = request.PessoaId
            };

            // Adiciona a transação ao banco de dados.
            db.Transacoes.Add(transacao);

            // Salva as alterações.
            await db.SaveChangesAsync();

            // Retorna HTTP 201 com os dados da transação criada.
            return Results.Created(
                $"/api/transacoes/{transacao.Id}",
                new TransacaoResponse(
                    transacao.Id,
                    transacao.PessoaId,
                    transacao.Descricao,
                    transacao.Valor,
                    transacao.Tipo,
                    pessoa.Nome,
                    transacao.DataCriacao));
        })
        .WithSummary("Cria transação (com validação de idade para receita)");

        // Lista todas as transações cadastradas.
        group.MapGet("", async (AppDbContext db) =>
            await db.Transacoes

                // Carrega também os dados da pessoa vinculada à transação.
                .Include(t => t.Pessoa)

                // Converte a entidade para o DTO de resposta.
                .Select(t => new TransacaoResponse(
                    t.Id,
                    t.PessoaId,
                    t.Descricao,
                    t.Valor,
                    t.Tipo,
                    t.Pessoa.Nome,
                    t.DataCriacao))

                // Retorna a lista de transações.
                .ToListAsync())
        .WithSummary("Lista todas as transações");
    }
}