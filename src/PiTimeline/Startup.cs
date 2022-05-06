using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using PiTimeline.Background;
using PiTimeline.Controllers;
using PiTimeline.Domain;
using PiTimeline.Infrastructure;
using PiTimeline.Shared.Configuration;
using PiTimeline.Shared.Dtos;
using System.Text;

namespace PiTimeline
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
            FFMpegCore.GlobalFFOptions.Configure(new FFMpegCore.FFOptions { BinaryFolder = Configuration.GetValue<string>("Gallery:FFMpegBin") });

            services.AddControllersWithViews();
            services.AddSwaggerGen();

            services.Configure<AuthConfiguration>(Configuration.GetSection("Auth"));
            services.Configure<GalleryConfiguration>(Configuration.GetSection("Gallery"));
            services.AddAutoMapper(typeof(MappingProfile));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = Configuration.GetValue<string>("Auth:Issuer"),
                        ValidAudience = Configuration.GetValue<string>("Auth:Audience"),
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Auth:Secret"] + "0123456789abcdef"))
                    };
                });

            services.AddSingleton<GalleryValueTransformer>();

            services.AddMediatR(typeof(Timeline).Assembly, typeof(Startup).Assembly);

            services.AddDbContext<MyDbContext>(opt => opt.UseSqlite(Configuration.GetConnectionString("Sqlite")));
            services.AddScoped<ITimelineRepository, TimelineRepository>();
            services.AddScoped<IMomentRepository, MomentRepository>();
            services.AddScoped<TimelineQueries>();
            services.AddScoped<DirectoryMetadataBuilder>();

            services.AddSingleton<Shared.Utilities.MediaUtilities>();
            services.AddSingleton<ThumbnailService>();
            services.AddSingleton<PhotoThumbnailService>();
            services.AddSingleton<VideoThumbnailService>();

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

            //app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

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
                            logger.LogError(exception, exception.Message);
                            break;
                    }
                });
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapDynamicControllerRoute<GalleryValueTransformer>("api/gallery/{*path}");
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
        }
    }
}
