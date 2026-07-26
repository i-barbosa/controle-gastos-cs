using ControleGastos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleGastos.Api.Data;

// Responsável por configurar a conexão com o banco de dados
// e mapear as entidades utilizadas pela aplicação.
public class AppDbContext : DbContext
{
    // Recebe as configurações do banco definidas no Program.cs.
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Representa a tabela de pessoas.
    public DbSet<Pessoa> Pessoas => Set<Pessoa>();

    // Representa a tabela de transações.
    public DbSet<Transacao> Transacoes => Set<Transacao>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configura o relacionamento entre Pessoa e Transação.
        // Uma pessoa pode possuir várias transações.
        modelBuilder.Entity<Transacao>()
            .HasOne(t => t.Pessoa)
            .WithMany(p => p.Transacoes)
            .HasForeignKey(t => t.PessoaId)
            .OnDelete(DeleteBehavior.Cascade); // Remove as transações ao excluir uma pessoa.
    }
}