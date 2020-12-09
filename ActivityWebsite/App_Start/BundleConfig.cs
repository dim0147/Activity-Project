using System.Web.Optimization;

namespace ActivityWebsite
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            #region helper
            // jQuery
            bundles.Add(new ScriptBundle("~/plugin/jquery").Include(
                        "~/Plugins/jQuery/js/jquery-3.3.1.min.js"));

            bundles.Add(new ScriptBundle("~/plugin/jqueryval").Include(
                        "~/Plugins/jQuery/js/jquery.validate*"));

            // Bootstrap
            bundles.Add(new ScriptBundle("~/plugin/bootstrap/js").Include(
                      "~/Plugins/Bootstrap/bootstrap.min.js"));

            bundles.Add(new StyleBundle("~/plugin/bootstrap/css").Include(
                      "~/Plugins/Bootstrap/bootstrap.min.css"));

            // Font-awesome
            bundles.Add(new ScriptBundle("~/plugin/font-awesome").Include(
                      "~/Plugins/Font-awesome/css/font-awesome.min.css"));
            #endregion

            #region User
            bundles.Add(new StyleBundle("~/User/Shared/css").Include(
                    "~/Plugins/ElegantIcons/css/elegant-icons.css",
                    "~/Plugins/jQuery/css/nice-select.css",
                    "~/Plugins/jQuery/css/barfiller.css",
                    "~/Plugins/jQuery/css/owl.carousel.min.css",
                    "~/Plugins/jQuery/css/slicknav.min.css",
                    "~/Content/css/Shared/style.css"
                    ));

            bundles.Add(new ScriptBundle("~/User/Shared/js").Include(
                    "~/Plugins/jQuery/js/jquery.nice-select.min.js",
                    "~/Plugins/jQuery/js/jquery.barfiller.js",
                    "~/Plugins/jQuery/js/jquery.slicknav.js",
                    "~/Plugins/jQuery/js/owl.carousel.min.js",
                    "~/Scripts/User/Shared/main.js"
                ));
            #endregion
        }
    }
}
