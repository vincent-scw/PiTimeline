using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Routing;
using System.Threading.Tasks;

namespace PiTimeline.Controllers
{
    public class GalleryValueTransformer : DynamicRouteValueTransformer
    {
        public override ValueTask<RouteValueDictionary> TransformAsync(HttpContext httpContext, RouteValueDictionary values)
        {
            if (!values.ContainsKey("path") || values["path"] == null)
                return ValueTask.FromResult(values);

            values["controller"] = "Gallery";
            values["action"] = "HandlePath";
            
            return ValueTask.FromResult(values);
        }
    }
}
