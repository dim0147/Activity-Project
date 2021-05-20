using ActivityWebsite.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ActivityWebsite.Config;
using ActivityWebsite.Models;
using System.Web.Http.Cors;
using static ActivityWebsite.Authenticate.AuthorizeRoute;
using System.Web;

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


        [HttpGet]
        [Route("api/category/get-all-category")]
        [Authorize(Roles = "Admin")]
        [VerifyUser]
        public IHttpActionResult GetAllCategory()
        {
            return Json(EF.CategoryHandle.GetAllCategoryByAdmin());
        }


        [HttpPost]
        [Route("api/category/add")]
        [Authorize(Roles = "Admin")]
        [VerifyUser]
        public IHttpActionResult AddCategory(AddCategoryModel model)
        {
            if (!ModelState.IsValid)
            {
                return Content(HttpStatusCode.BadRequest, "Invalid request");
            }

            return Content(HttpStatusCode.BadRequest, new { model = model, test = HttpContext.Current.Request.Files });
        }


        [HttpDelete]
        [Route("api/category/delete/{id}")]
        [Authorize(Roles = "Admin")]
        [VerifyUser]
        public IHttpActionResult DeleteCategory(int id)
        {
            var result = EF.CategoryHandle.DeleteCategory(id);

            if (!result) return Content(HttpStatusCode.InternalServerError, "Delete failed");
            return Content(HttpStatusCode.OK, "Delete success");
        }

    }
}
