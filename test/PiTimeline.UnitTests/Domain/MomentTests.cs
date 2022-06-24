using PiTimeline.Domain;
using System;
using Xunit;

namespace PiTimeline.UnitTests.Domain
{
    public class MomentTests
    {
        [Fact]
        public void UpdateMoment_ShouldRaiseEvent()
        {
            var moment = new Moment("T1", "TEST", DateTime.Today);
            Assert.Equal(1, moment.DomainEvents.Count);

            moment.Update("Updated", DateTime.Now);
            Assert.Equal(2, moment.DomainEvents.Count);
        }
    }
}
