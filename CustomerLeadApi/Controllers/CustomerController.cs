using CustomerLeadApi.Models;
using CustomerLeadApi.Repository;
using Microsoft.AspNetCore.Mvc;

namespace CustomerLeadApi.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class CustomerController : ControllerBase
	{
		private readonly CustomerRepository _repo;

		public CustomerController(CustomerRepository repo)
		{
			_repo = repo;
		}

		[HttpPost]
		public IActionResult Create([FromBody] string name)
		{
			var customer = _repo.Create(name);
			return Ok(customer);
		}

		[HttpGet("{id}")]
		public IActionResult Get(Guid id)
		{
			var customer = _repo.Get(id);
			if (customer == null) return NotFound();
			return Ok(customer);
		}

		[HttpPost("{id}/images")]
		public IActionResult UploadImages(Guid id, [FromBody] List<string> base64Images)
		{
			var customer = _repo.Get(id);
			if (customer == null) return NotFound();

			if (customer.Images.Count + base64Images.Count > 10)
				return BadRequest("Maximum of 10 images allowed per customer");

			foreach (var base64 in base64Images)
			{
				customer.Images.Add(new CustomerImage { Base64Data = base64 });
			}
			return Ok(customer.Images);
		}

		[HttpGet("{id}/images")]
		public IActionResult GetImages(Guid id)
		{
			var customer = _repo.Get(id);
			if (customer == null) return NotFound();
			return Ok(customer.Images);
		}

		[HttpDelete("{id}/images/{imageId}")]
		public IActionResult DeleteImage(Guid id, Guid imageId)
		{
			var customer = _repo.Get(id);
			if (customer == null) return NotFound();

			var image = customer.Images.FirstOrDefault(i => i.Id == imageId);
			if (image == null) return NotFound();

			customer.Images.Remove(image);
			return Ok(customer.Images);
		}
	}
}
