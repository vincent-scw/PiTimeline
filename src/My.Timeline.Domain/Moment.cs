using System;
using System.Collections.Generic;
using System.Linq;
using MyTimeline.Domain.SeedWork;
using MyTimeline.Shared.Utilities;

namespace MyTimeline.Domain
{
    public class Moment : Entity
    {
        protected Moment()
        {
            _photos = new List<Photo>();
        }

        public Moment(string content, IEnumerable<Photo> photos)
            : this()
        {
            Id = IdGen.Generate();
            CreatedDateTime = DateTime.Now;

            Content = content;
            if (photos != null)
                _photos = photos.ToList();
        }

        public string Content { get; }

        private List<Photo> _photos;
        public IReadOnlyList<Photo> Photos => _photos;
    }
}
