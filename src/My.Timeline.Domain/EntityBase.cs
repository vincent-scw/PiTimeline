using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using My.Timeline.Utilities;

namespace My.Timeline.Domain
{
    public class EntityBase
    {
        public EntityBase()
        {
            Id = IdGen.Generate();
        }

        public string Id { get; protected set; }
    }
}
