namespace CustomerLeadApi.Models
{
	public class CustomerImage
	{
		public Guid Id { get; set; } = Guid.NewGuid();
		public string Base64Data { get; set; } = string.Empty;
	}
}
