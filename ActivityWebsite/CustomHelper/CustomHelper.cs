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
            return new JsonResult
            {
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = JSONObject
            };
        }

        public static string GerenateUrlSlug(string url)
        {
            return new SlugHelper().GenerateSlug(url);
        }

        public static JsonResult AddModelError(ModelStateDictionary ModelState)
        {
            List<string> listErrors = new List<string>();
            foreach (ModelState modelState in ModelState.Values)
            {
                foreach (ModelError error in modelState.Errors)
                {
                    if (string.IsNullOrEmpty(error.ErrorMessage))
                    {
                        listErrors.Add("Unexpected Error!");
                    }
                    else
                    {
                        listErrors.Add(error.ErrorMessage);
                    }
                }
            }

            return new JsonResult()
            {
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                Data = new
                {
                    error = true,
                    errors = listErrors
                }
            };
        }

    }
}