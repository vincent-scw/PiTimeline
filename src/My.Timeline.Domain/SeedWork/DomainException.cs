using System;

namespace MyTimeline.Domain.SeedWork
{
    public static class DefinedExceptions
    {
        public const string NotFound = nameof(NotFound);
    }

    public class DomainException : Exception
    {
        public string Code { get; set; }

        public DomainException(string code)
        {
            Code = code;
        }

        public DomainException(string code, string message)
            : base(message)
        {
            Code = code;
        }
    }
}
