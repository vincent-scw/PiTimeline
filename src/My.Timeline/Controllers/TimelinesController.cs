using Microsoft.AspNetCore.Mvc;
using MyTimeline.Domain;
using System.Threading.Tasks;
using MyTimeline.Infrastructure;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MyTimeline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimelinesController : ControllerBase
    {
        private readonly ITimelineRepository _repository;
        private readonly TimelineQueries _queries;
        public TimelinesController(
            ITimelineRepository repository,
            TimelineQueries queries)
        {
            _repository = repository;
            _queries = queries;
        }

        [HttpGet]
        public async Task<IActionResult> FetchLines()
        {
            var result = await _queries.FetchLinesAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var result = await _queries.GetLineAsync(id);
            return Ok(result);
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
