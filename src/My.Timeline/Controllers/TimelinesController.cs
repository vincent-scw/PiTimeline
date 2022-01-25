using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyTimeline.Infrastructure;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MyTimeline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimelinesController : ControllerBase
    {
        private readonly TimelineRepository _repository;
        public TimelinesController(TimelineRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> FetchLines()
        {
            var result = _repository.FetchLinesAsync();
            return Ok(result);
        }

        // GET api/<LinesController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<LinesController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<LinesController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<LinesController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
