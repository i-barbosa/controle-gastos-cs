using ControleGastos.Api.Data;
using ControleGastos.Api.Dtos;
using ControleGastos.Api.Endpoints;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configura a conexão com o banco de dados SQLite.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Habilita a documentação da API com Swagger.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configura o CORS para permitir requisições do frontend.
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// Cria a aplicação.
var app = builder.Build();

// Habilita o Swagger apenas em ambiente de desenvolvimento.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Redireciona requisições para HTTPS.
app.UseHttpsRedirection();

// Habilita a política de CORS configurada anteriormente.
app.UseCors();

// Cria um escopo para acessar os serviços da aplicação.
using (var scope = app.Services.CreateScope())
{
    // Obtém uma instância do contexto do banco de dados.
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    // Aplica automaticamente as migrations pendentes.
    await db.Database.MigrateAsync();

    // Popula o banco com dados de demonstração quando a aplicação
    // for iniciada utilizando o argumento "--seed".
    if (args.Contains("--seed"))
    {
        await DbSeeder.SeedAsync(db);

        Console.WriteLine("Banco populado com sucesso.");

        return;
    }
}

// Registra os endpoints relacionados às pessoas.
app.MapPessoasEndpoints();

// Registra os endpoints relacionados às transações.
app.MapTransacoesEndpoints();

// Retorna os totais financeiros do sistema.
app.MapGet("/api/totais", async (AppDbContext db) =>
{
    // Carrega todas as pessoas juntamente com suas transações.
    var pessoas = await db.Pessoas
        .Include(p => p.Transacoes)
        .ToListAsync();

    // Calcula receitas, despesas e saldo de cada pessoa.
    var pessoasTotais = pessoas.Select(p =>
    {
        var receitas = p.Transacoes
            .Where(t => t.Tipo == 1)
            .Sum(t => t.Valor);

        var despesas = p.Transacoes
            .Where(t => t.Tipo == 0)
            .Sum(t => t.Valor);

        return new PessoaTotaisDto(
            p.Id,
            p.Nome,
            receitas,
            despesas,
            receitas - despesas);
    }).ToList();

    // Calcula os totais gerais do sistema.
    var totalReceitas = pessoasTotais.Sum(p => p.TotalReceitas);
    var totalDespesas = pessoasTotais.Sum(p => p.TotalDespesas);

    // Monta o objeto de resposta da API.
    var totaisGerais = new TotaisGeraisDto(
        totalReceitas,
        totalDespesas,
        totalReceitas - totalDespesas,
        pessoasTotais);

    // Retorna os totais calculados.
    return Results.Ok(totaisGerais);
})
.WithTags("Totais")
.WithSummary("Retorna totais por pessoa e gerais");

// Inicia a aplicação.
app.Run();