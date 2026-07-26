using ControleGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        var italo = await db.Pessoas.FirstOrDefaultAsync(p => p.Nome == "Italo")
            ?? await db.Pessoas.FirstOrDefaultAsync();

        if (italo is null)
        {
            italo = new Pessoa { Nome = "Italo", Idade = 21 };
            db.Pessoas.Add(italo);
            await db.SaveChangesAsync();
        }

        var maria = await EnsurePessoaAsync(db, "Maria Silva", 47);
        var joao = await EnsurePessoaAsync(db, "João Silva", 51);

        db.Transacoes.RemoveRange(db.Transacoes);
        await db.SaveChangesAsync();

        var transacoes = new List<Transacao>();
        var meses = Enumerable.Range(0, 10)
            .Select(i => new DateTime(2025, 9, 1).AddMonths(i))
            .ToList();

        foreach (var mes in meses)
        {
            var diaSalario = 5;
            var verao = mes.Month is 12 or 1 or 2 or 3;
            var fimAno = mes.Month is 11 or 12;

            transacoes.AddRange([
                // Salários — dia 5
                Criar(italo.Id, "Salário CLT - Auxiliar Administrativo", 2200m, 1, mes, diaSalario),
                Criar(maria.Id, "Salário CLT - Analista de RH", 3800m, 1, mes, diaSalario),
                Criar(joao.Id, "Salário CLT - Supervisor de Manutenção", 4800m, 1, mes, diaSalario),

                // Moradia — João paga aluguel e condomínio (Recife - Casa Amarela)
                Criar(joao.Id, "Aluguel apartamento 2 quartos - Casa Amarela", 2200m, 0, mes, 8),
                Criar(joao.Id, "Condomínio + taxa de lixo", 380m, 0, mes, 8),
                Criar(joao.Id, "IPTU (parcela mensal)", 95m, 0, mes, 10),

                // Contas da casa — divididas de forma realista
                Criar(maria.Id, "Conta de água - Compesa", verao ? 118m : 92m, 0, mes, 12),
                Criar(joao.Id, "Conta de luz - Neoenergia Pernambuco", verao ? 298m : 215m, 0, mes, 14),
                Criar(italo.Id, "Internet fibra 500Mb - Vivo", 119.90m, 0, mes, 15),
                Criar(maria.Id, "Gás de cozinha (botijão 13kg)", mes.Month % 2 == 0 ? 110m : 0m, 0, mes, 18),

                // Alimentação — Maria faz compras principais
                Criar(maria.Id, "Supermercado - Assaí Atacadista", fimAno ? 2100m : 1780m, 0, mes, 6),
                Criar(maria.Id, "Feira livre - Casa Amarela", 220m, 0, mes, 20),
                Criar(italo.Id, "iFood / lanches da semana", 180m, 0, mes, 22),

                // Saúde e farmácia
                Criar(maria.Id, "Farmácia - remédios e higiene", 145m, 0, mes, 16),
                Criar(joao.Id, "Plano de saúde - Unimed (coparticipação)", 450m, 0, mes, 7),

                // Transporte — Recife (BRT + Uber eventual)
                Criar(italo.Id, "Bilhete único + Uber (trabalho/faculdade)", 285m, 0, mes, 3),
                Criar(maria.Id, "Combustível + estacionamento (carro)", 420m, 0, mes, 9),
                Criar(joao.Id, "Manutenção veículo / revisão", mes.Month % 3 == 0 ? 350m : 0m, 0, mes, 25),

                // Pessoal — Italo (21 anos)
                Criar(italo.Id, "Mensalidade faculdade - FICR", 689m, 0, mes, 2),
                Criar(italo.Id, "Plano de celular - Claro", 79.99m, 0, mes, 11),
                Criar(italo.Id, "Academia - Smart Fit Boa Viagem", 89.90m, 0, mes, 1),
                Criar(italo.Id, "Corte de cabelo + barbearia", 45m, 0, mes, 19),
                Criar(italo.Id, "Lazer - cinema, bar e praia de Boa Viagem", fimAno ? 320m : 190m, 0, mes, 28),

                // Pessoal — Maria
                Criar(maria.Id, "Plano de celular - Tim", 69.99m, 0, mes, 11),
                Criar(maria.Id, "Salão de beleza + manicure", 130m, 0, mes, 21),
                Criar(maria.Id, "Roupas e calçados - Shopping Recife", mes.Month % 2 == 1 ? 280m : 0m, 0, mes, 24),

                // Pessoal — João
                Criar(joao.Id, "Plano de celular - Vivo", 89.99m, 0, mes, 11),
                Criar(joao.Id, "Ferramentas / material de trabalho", mes.Month % 4 == 0 ? 220m : 0m, 0, mes, 17),
                Criar(joao.Id, "Restaurante / almoço com colegas de trabalho", 160m, 0, mes, 23),

                // Assinaturas compartilhadas
                Criar(italo.Id, "Netflix + Spotify (família)", 75.80m, 0, mes, 1),
            ]);
        }

        // Despesas extras pontuais nos 10 meses
        transacoes.Add(Criar(joao.Id, "Conserto geladeira - assistência técnica", 480m, 0, new DateTime(2025, 11, 18)));
        transacoes.Add(Criar(maria.Id, "Material escolar / livros - Italo", 390m, 0, new DateTime(2026, 2, 5)));
        transacoes.Add(Criar(joao.Id, "IPVA + licenciamento veículo", 890m, 0, new DateTime(2026, 3, 12)));
        transacoes.Add(Criar(maria.Id, "Compras de Natal - presentes e ceia", 650m, 0, new DateTime(2025, 12, 20)));
        transacoes.Add(Criar(italo.Id, "Consulta dentista - limpeza", 180m, 0, new DateTime(2026, 4, 8)));
        transacoes.Add(Criar(joao.Id, "Seguro residencial (anual parcelado)", 125m, 0, new DateTime(2025, 9, 15)));

        db.Transacoes.AddRange(transacoes.Where(t => t.Valor > 0));
        await db.SaveChangesAsync();
    }

    private static async Task<Pessoa> EnsurePessoaAsync(AppDbContext db, string nome, int idade)
    {
        var pessoa = await db.Pessoas.FirstOrDefaultAsync(p => p.Nome == nome);
        if (pessoa is not null) return pessoa;

        pessoa = new Pessoa { Nome = nome, Idade = idade };
        db.Pessoas.Add(pessoa);
        await db.SaveChangesAsync();
        return pessoa;
    }

    private static Transacao Criar(Guid pessoaId, string descricao, decimal valor, int tipo, DateTime mes, int dia)
    {
        var data = new DateTime(mes.Year, mes.Month, Math.Min(dia, DateTime.DaysInMonth(mes.Year, mes.Month)), 10, 0, 0, DateTimeKind.Utc);
        return Criar(pessoaId, descricao, valor, tipo, data);
    }

    private static Transacao Criar(Guid pessoaId, string descricao, decimal valor, int tipo, DateTime data)
        => new()
        {
            PessoaId = pessoaId,
            Descricao = descricao,
            Valor = valor,
            Tipo = tipo,
            DataCriacao = data
        };
}
