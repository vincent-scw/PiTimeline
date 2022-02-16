using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MyTimeline.Shared.Dtos;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyTimeline.Infrastructure
{
    public class TimelineQueries
    {
        private readonly MyDbContext _dbContext;
        private readonly IMapper _mapper;

        public TimelineQueries(

            MyDbContext dbContext,
            IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<List<TimelineDto>> FetchLinesAsync()
        {
            var timelines = await _dbContext.Timelines.Where(x => !x.IsDeleted).ToListAsync();
            return timelines.Select(x => _mapper.Map<TimelineDto>(x)).ToList();
        }

        public async Task<TimelineDto> GetLineAsync(string id)
        {
            var timeline = await _dbContext.Timelines.FirstOrDefaultAsync(x => x.Id == id);
            if (timeline == null)
                return null;

            var moments = await _dbContext.Moments.Where(m => m.TimelineId == timeline.Id && !m.IsDeleted)
                .OrderBy(x => x.TakePlaceAtDateTime)
                .ToListAsync();

            var dto = _mapper.Map<TimelineDto>(timeline);
            dto.Moments = moments.Select(m => _mapper.Map<MomentDto>(m)).ToList();
            return dto;
        }
    }
}
