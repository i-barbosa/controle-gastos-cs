using System.ComponentModel.DataAnnotations;

namespace ControleGastos.Api.Models;

public class Transacao
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required, MaxLength(200)]
    public string Descricao { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue)]
    public decimal Valor { get; set; }

    public int Tipo { get; set; } // 0 = Despesa, 1 = Receita

    public Guid PessoaId { get; set; }
    public Pessoa Pessoa { get; set; } = null!;
}