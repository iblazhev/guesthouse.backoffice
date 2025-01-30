public class PaymentModel
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Comments { get; set; } = null!;
    public decimal Amount { get; set; }
    public bool IsExpense { get; set; }
    public DateTime CreatedAt { get; set; }
}