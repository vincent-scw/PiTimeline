using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MyTimeline.Domain;
using MyTimeline.Infrastructure;
using MyTimeline.Shared.Dtos;

namespace MyTimeline
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews();
            services.AddSwaggerGen();
            services.AddAutoMapper(typeof(MappingProfile));

            services.Configure<DbConfiguration>(Configuration.GetSection("ConnectionStrings:Sqlite"));
            services.AddDbContext<MyDbContext>();
            services.AddScoped<ITimelineRepository, TimelineRepository>();
            services.AddScoped<TimelineQueries>();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });

            app.UseExceptionHandler(builder =>
            {
                builder.Use(async (ctx, next) =>
                {
                    var feature = ctx.Features.Get<IExceptionHandlerPathFeature>();
                    var exception = feature.Error;

                    var logger = ctx.RequestServices.GetService<ILogger<Startup>>();

                    switch (exception)
                    {
                        case null:
                            await next();
                            break;
                        default:
                            await ctx.Response.WriteAsJsonAsync(new ErrorResponse("Exception", exception.Message));
                            logger.LogError(exception.StackTrace ?? exception.Message);
                            break;
                    }
                });
            });
        }
    }
}
