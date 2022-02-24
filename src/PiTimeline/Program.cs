using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace PiTimeline
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>()
                        .ConfigureAppConfiguration(builder =>
                        {
                            var varPath = Environment.GetEnvironmentVariable("VARIABLE_PATH");
                            if (varPath == null) return;
                            builder.AddJsonFile(varPath, false, true);
                        });
                });
    }
}
