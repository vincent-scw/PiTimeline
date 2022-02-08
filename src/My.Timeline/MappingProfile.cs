using AutoMapper;
using MyTimeline.Domain;
using MyTimeline.Shared.Dtos;

namespace MyTimeline
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
