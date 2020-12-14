using Slugify;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ActivityWebsite.CustomHelper
{
    public class Helper
    {
        public static JsonResult gerenateJsonRs(Object JSONObject)
        {
            return  new JsonResult
            {
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = JSONObject
            };
        }

        public static string GerenateUrlSlug(string url)
        {
            return new SlugHelper().GenerateSlug(url);
        }

    }
}