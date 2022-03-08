using System;
using System.IO;
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
                            var varPath = Environment.GetEnvironmentVariable("CONFIG_PATH");
                            if (varPath == null && OperatingSystem.IsLinux())
                            {
                                var path = "/var/PiTimeline/config.json";
                                if (File.Exists(path))
                                    varPath = path;
                            }
                            if (varPath == null)
                                return;
                            
                            builder.AddJsonFile(varPath, false, true);
                        });
                });
    }
}
