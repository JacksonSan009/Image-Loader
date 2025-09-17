namespace CustomerLeadApi.Models
{
	public class Customer
	{
		public Guid Id { get; set; } = Guid.NewGuid();
		public string Name { get; set; } = string.Empty;

		// Limit 10 images per customer
		public List<CustomerImage> Images { get; set; } = new List<CustomerImage>();
	}
}
