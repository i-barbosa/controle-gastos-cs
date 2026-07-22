using System.ComponentModel.DataAnnotations;

namespace ControleGastos.Api.Models;

public class Pessoa
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required, MaxLength(100)]
    public string Nome { get; set; } = string.Empty;

    [Range(0, 120)]
    public int Idade { get; set; }

    public List<Transacao> Transacoes { get; set; } = new();
}