﻿using ActivityWebsite.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ActivityWebsite.Config;
using System.Web.Http.Cors;

namespace ActivityWebsite.Api
{
    //[EnableCors(origins: "http://localhost:3000", headers: "*", methods: "*")]
    public class CategoryController : ApiController
    {
        public IHttpActionResult Get()
        {
            List<Category> categories = EF.CategoryHandle.GetAllCategory();
            foreach (Category category in categories)
            {
                category.image = $"{ConfigurationApp.URL_DIR_CATEGORY_IMAGE}/{category.image}";
            }
            return Json(new { categories = categories });
        }

    }
}
