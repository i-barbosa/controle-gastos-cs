using ControleGastos.Api.Data;
using ControleGastos.Api.Dtos;
using ControleGastos.Api.Endpoints;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS - Liberado para qualquer origem (ajuste em produção)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();

// Migrations automáticas em desenvolvimento
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync(); // Cria banco e tabelas automaticamente
}

// Endpoints
app.MapPessoasEndpoints();
app.MapTransacoesEndpoints();

// GET /api/totais
app.MapGet("/api/totais", async (AppDbContext db) =>
{
    var pessoas = await db.Pessoas
        .Include(p => p.Transacoes)
        .ToListAsync();

    var pessoasTotais = pessoas.Select(p =>
    {
        var receitas = p.Transacoes.Where(t => t.Tipo == 1).Sum(t => t.Valor);
        var despesas = p.Transacoes.Where(t => t.Tipo == 0).Sum(t => t.Valor);
        return new PessoaTotaisDto(p.Id, p.Nome, receitas, despesas, receitas - despesas);
    }).ToList();

    var totalReceitas = pessoasTotais.Sum(p => p.TotalReceitas);
    var totalDespesas = pessoasTotais.Sum(p => p.TotalDespesas);

    var totaisGerais = new TotaisGeraisDto(
        totalReceitas,
        totalDespesas,
        totalReceitas - totalDespesas,
        pessoasTotais);

    return Results.Ok(totaisGerais);
})
.WithTags("Totais")
.WithSummary("Retorna totais por pessoa e gerais");

app.Run();