using System.Web.Mvc;

namespace ActivityWebsite.Areas.Admin
{
    public class AdminAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Admin";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                name: "Admin_React",
                url: "Admin/{*url}",
                defaults: new { controller ="React", action = "Index" },
                namespaces: new[] { "ActivityWebsite.Areas.Admin.Controllers" }
            );
        }
    }
}