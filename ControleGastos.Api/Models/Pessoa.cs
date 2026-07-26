using System.ComponentModel.DataAnnotations;

namespace ControleGastos.Api.Models;

// Representa uma pessoa cadastrada no sistema.
public class Pessoa
{
    // Gera automaticamente um identificador único para cada pessoa.
    public Guid Id { get; set; } = Guid.NewGuid();

    // Nome da pessoa.
    [Required, MaxLength(100)]
    public string Nome { get; set; } = string.Empty;

    // Idade utilizada para aplicar as regras de negócio do sistema.
    [Range(0, 120)]
    public int Idade { get; set; }

    // Lista de transações vinculadas à pessoa.
    public List<Transacao> Transacoes { get; set; } = new();
}