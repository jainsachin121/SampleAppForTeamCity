using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SampleAppForTeamCity.Models;

namespace SampleAppForTeamCity.Controllers
{
    public class ProductsController : ApiController
    {
        ProductModel[] products = new ProductModel[]
        {
            new ProductModel { Id = 1, Name = "Tomato Soup", Category = "Groceries", Price = 1 },
            new ProductModel { Id = 2, Name = "Yo-yo", Category = "Toys", Price = 3.75M },
            new ProductModel { Id = 3, Name = "Hammer", Category = "Hardware", Price = 16.99M }
        };

        public IEnumerable<ProductModel> GetAllProducts()
        {
            return products;
        }

        public IHttpActionResult GetProduct(int id)
        {
            var product = products.FirstOrDefault((p) => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }
    }
}