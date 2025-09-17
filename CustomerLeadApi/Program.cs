using CustomerLeadApi.Repository;
using CustomerLeadApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add repository as singleton (in-memory)
builder.Services.AddSingleton<CustomerRepository>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.UseCors(policy =>
	policy.AllowAnyOrigin()
		  .AllowAnyHeader()
		  .AllowAnyMethod()
);

using (var scope = app.Services.CreateScope())
{
	var repo = scope.ServiceProvider.GetRequiredService<CustomerRepository>();
	var seededCustomer = repo.Create("Test User");
	Console.WriteLine($"Seeded customer: {seededCustomer.Name}, ID: {seededCustomer.Id}");
}

app.Run();
