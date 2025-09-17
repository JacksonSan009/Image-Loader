using CustomerLeadApi.Models;

namespace CustomerLeadApi.Repository
{
	public class CustomerRepository
	{
		private readonly Dictionary<Guid, Customer> _customers = new();

		public Customer Create(string name)
		{
			var customer = new Customer { Name = name };
			_customers[customer.Id] = customer;
			return customer;
		}

		public Customer? Get(Guid id) =>
			_customers.TryGetValue(id, out var customer) ? customer : null;

		public IEnumerable<Customer> GetAll() => _customers.Values;
	}
}