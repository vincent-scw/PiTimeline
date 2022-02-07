using MyTimeline.Domain.SeedWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyTimeline.Domain
{
    public class MomentPhoto : ValueObject
    {
        public MomentPhoto()
        {

        }

        public int Sequence { get; private set; }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            throw new NotImplementedException();
        }
    }
}
