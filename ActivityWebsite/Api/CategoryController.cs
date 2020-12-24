using ActivityWebsite.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ActivityWebsite.Api
{
    public class CategoryController : ApiController
    {
        private static string DIR_IMAGE =  "/Content/Media/Images/Category";
        public IHttpActionResult Get()
        {
            List<Category> categories = EF.CategoryHandle.GetAllCategory();
            foreach (Category category in categories)
            {
                category.image = $"{DIR_IMAGE}/{category.image}";
            }
            return Json(new { categories = categories });
        }

    }
}
