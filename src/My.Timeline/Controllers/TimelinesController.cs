using Microsoft.AspNetCore.Mvc;
using MyTimeline.Domain;
using MyTimeline.Infrastructure;
using System.Threading.Tasks;
using AutoMapper;
using MyTimeline.Dtos;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MyTimeline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimelinesController : ControllerBase
    {
        private readonly ITimelineRepository _timelineRepository;
        private readonly TimelineQueries _queries;
        private readonly IMapper _mapper;
        public TimelinesController(
            ITimelineRepository timelineRepository,
            TimelineQueries queries,
            IMapper mapper)
        {
            _timelineRepository = timelineRepository;
            _queries = queries;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> FetchLines()
        {
            var result = await _queries.FetchLinesAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLine(string id)
        {
            var result = await _queries.GetLineAsync(id);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateLine([FromBody] TimelineDto dto)
        {
            var timeline = _mapper.Map<Timeline>(dto);
            var result = await _timelineRepository.AddAsync(timeline);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLine(string id, [FromBody] TimelineDto dto)
        {
            var timeline = await _timelineRepository.GetByIdAsync(id);
            timeline.Update(dto.Title, dto.IsCompleted);

            await _timelineRepository.UpdateAsync(timeline);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLine(string id)
        {
            await _timelineRepository.DeleteAsync(id);
            return NoContent();
        }

        //[HttpPost("{lineId}/moments")]
        //public async Task<IActionResult> AddMoment(string lineId, [FromBody] Moment moment)
        //{
        //    var result = _momentRepository.Add(moment);
        //    await _momentRepository.UnitOfWork.SaveChangesAsync();
        //    return Ok(result);
        //}

        //[HttpPost("{lineId}/moments/{momentId}")]
        //public async Task<IActionResult> UpdateMoment(string lineId, string momentId, [FromBody] Moment moment)
        //{
        //    _momentRepository.Update(moment);
        //    await _momentRepository.UnitOfWork.SaveChangesAsync();
        //    return Ok();
        //}
    }
}
