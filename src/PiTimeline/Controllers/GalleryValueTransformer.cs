using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Routing;
using System;
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
            var t = Convert.ToString(values["path"]).Substring(0, 2).ToLower();
            if (t.Equals("f/"))
                values["action"] = "HandleFile";
            else
                values["action"] = "HandleDir";

            values["path"] = Convert.ToString(values["path"]).Substring(2);

            return ValueTask.FromResult(values);
        }
    }
}
