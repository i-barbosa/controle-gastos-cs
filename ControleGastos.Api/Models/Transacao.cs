using System.ComponentModel.DataAnnotations;

namespace ControleGastos.Api.Models;

// Representa uma transação financeira cadastrada no sistema.
public class Transacao
{
    // Gera automaticamente um identificador único para cada transação.
    public Guid Id { get; set; } = Guid.NewGuid();

    // Descrição informada para identificar a transação.
    [Required, MaxLength(200)]
    public string Descricao { get; set; } = string.Empty;

    // Valor da receita ou despesa.
    [Range(0.01, double.MaxValue)]
    public decimal Valor { get; set; }

    // Define o tipo da transação (0 = Despesa, 1 = Receita).
    public int Tipo { get; set; }

    // Registra a data e o horário em que a transação foi criada.
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

    // Identificador da pessoa responsável pela transação.
    public Guid PessoaId { get; set; }

    // Referência para a pessoa vinculada à transação.
    public Pessoa Pessoa { get; set; } = null!;
}