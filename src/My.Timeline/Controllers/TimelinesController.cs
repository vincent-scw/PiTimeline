﻿using Microsoft.AspNetCore.Mvc;
using MyTimeline.Domain;
using MyTimeline.Infrastructure;
using System.Threading.Tasks;
using AutoMapper;
using MyTimeline.Shared.Dtos;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MyTimeline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimelinesController : ControllerBase
    {
        private readonly ITimelineRepository _timelineRepository;
        private readonly IMomentRepository _momentRepository;
        private readonly TimelineQueries _queries;
        private readonly IMapper _mapper;
        public TimelinesController(
            ITimelineRepository timelineRepository,
            IMomentRepository momentRepository,
            TimelineQueries queries,
            IMapper mapper)
        {
            _timelineRepository = timelineRepository;
            _momentRepository = momentRepository;
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
            return result == null ? NotFound(id) : Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateLine([FromBody] TimelineDto dto)
        {
            var timeline = new Timeline(dto.Title);
            var result = await _timelineRepository.AddAsync(timeline);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLine(string id, [FromBody] TimelineDto dto)
        {
            var timeline = await _timelineRepository.GetByIdAsync(id);
            timeline.Update(dto.Title);

            await _timelineRepository.UpdateAsync(timeline);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLine(string id)
        {
            await _timelineRepository.DeleteAsync(id, false);
            return NoContent();
        }

        [HttpPost("{lineId}/moments")]
        public async Task<IActionResult> AddMoment(string lineId, [FromBody] MomentDto moment)
        {
            // Check timeline
            var _ = await _timelineRepository.GetByIdAsync(lineId);
            var result = await _momentRepository.AddAsync(new Moment(lineId, moment.Content, moment.TakePlaceAtDateTime));
            
            return Ok(result);
        }

        [HttpPost("{lineId}/moments/{momentId}")]
        public async Task<IActionResult> UpdateMoment(string lineId, string momentId, [FromBody] MomentDto dto)
        {
            // Check timeline
            var _ = await _timelineRepository.GetByIdAsync(lineId);
            // Get moment
            var moment = await _momentRepository.GetByIdAsync(momentId);
            moment.Update(dto.Content, dto.TakePlaceAtDateTime);
            await _momentRepository.UpdateAsync(moment);
            return NoContent();
        }

        [HttpDelete("{lineId}/moments/{momentId}")]
        public async Task<IActionResult> DeleteMoment(string lineId, string momentId)
        {
            await _momentRepository.DeleteAsync(momentId, false);
            return NoContent();
        }
    }
}
