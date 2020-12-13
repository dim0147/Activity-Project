using ActivityWebsite.Areas.Admin.Models;
using ActivityWebsite.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using static ActivityWebsite.Authenticate.AuthorizeRoute;

namespace ActivityWebsite.Areas.Admin.Controllers
{
    [ManageAuthorize(Roles = "Admin,Moderator")]
    [VerifyUser]
    public class CategoryController : Controller
    {
        // GET: Admin/Category
        public ActionResult Index()
        {
            return View();
        }

        // GET: Admin/Category/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: Admin/Category/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Admin/Category/Create
        [HttpPost]
        public ActionResult Create(CategoryViewModel model)
        {
            using (var db = new DbModel())
            {
                // Check if category is exist
                var query = from ct in db.EntityCategories
                            where ct.name.Equals(model.Name)
                            select ct;
                var category = query.FirstOrDefault();
                if (category != null)
                {
                    ModelState.AddModelError("", $"Category '{model.Name} exist already!'");
                    return View(model);
                }

                // Create category
                EntityCategory newCategory = new EntityCategory()
                { 
                    name = model.Name, 
                    description = model.Description 
                };
                db.EntityCategories.Add(newCategory);
                db.SaveChanges();

                ViewBag.successMessage = $"Create category {newCategory.name} success!";
                return View(model);
            }



        }

        // GET: Admin/Category/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: Admin/Category/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Admin/Category/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: Admin/Category/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
