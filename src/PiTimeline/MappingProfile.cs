using AutoMapper;
using PiTimeline.Domain;
using PiTimeline.Shared.Dtos;

namespace PiTimeline
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            this.CreateMap<Timeline, TimelineDto>()
                .ForMember(d => d.LastUpdatedDateTime, opt => opt.MapFrom(s => s.UpdatedDateTime ?? s.CreatedDateTime))
                .ReverseMap()
                .ForMember(d => d.CreatedDateTime, opt => opt.Ignore())
                .ForMember(d => d.UpdatedDateTime, opt => opt.Ignore());
            this.CreateMap<Moment, MomentDto>()
                .ReverseMap();
        }
    }
}
