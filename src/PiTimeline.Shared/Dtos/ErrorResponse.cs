namespace PiTimeline.Shared.Dtos
{
    public class ErrorResponse
    {
        public string Code { get; set; }

        public string Message { get; set; }

        public DateTimeOffset Timestamp { get; set; }

        public ErrorResponse(string code, string message)
        {
            this.Code = code;
            this.Message = message;
            this.Timestamp = DateTimeOffset.UtcNow;
        }
    }
}
