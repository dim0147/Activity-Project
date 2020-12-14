using ActivityWebsite.Areas.Admin.Models;
using ActivityWebsite.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using static ActivityWebsite.Authenticate.AuthorizeRoute;
using static ActivityWebsite.CustomHelper.Helper;
using ActivityWebsite.EF;

namespace ActivityWebsite.Areas.Admin.Controllers
{

    [ManageAuthorize(Roles = "Admin,Moderator")]
    [VerifyUser]
    public class CategoryController : Controller
    {

        private const string IMAGE_UPLOAD_DIR = "~/Content/Media/Images/Category";


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
        public ActionResult Create(CategoryAddViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // Check if category is exist
            Category category = EF.CategoryHandle.FindCategoryByName(model.Name);
            if (category != null)
            {
                ModelState.AddModelError("", $"Category '{model.Name} exist already!'");
                return View(model);
            }

            // Upload Image
            string fileName = EF.ImageHandle.SaveImg(model.image, IMAGE_UPLOAD_DIR);
            if (fileName == null)
            {
                ModelState.AddModelError("", "Error while upload image!");
                return View(model);
            }

            // Create category
            using (var db = new DbModel())
            {
                Category newCategory = new Category()
                {
                    name = model.Name,
                    description = model.Description,
                    image = fileName,
                    type = "entity",
                    slug = GerenateUrlSlug(model.Name)
                };
                db.Categories.Add(newCategory);
                db.SaveChanges();
                ViewBag.successMessage = $"Create category {newCategory.name} success!";
                return View(model);
            }
        }

        // GET: Admin/Category/Edit/5
        public ActionResult Edit(long id)
        {
            using (var db = new DbModel())
            {

                CategoryEditViewModel model = new CategoryEditViewModel();

                // Check category is exist
                Category category = EF.CategoryHandle.FindCategoryById(id);
                if (category == null)
                {
                    ModelState.AddModelError("", "Can't find category");
                    return View(model);
                }

                // Render category
                model.Name = category.name;
                model.CurrentImage = category.image;
                model.Description = category.description;
                return View(model);
            }
        }

        // POST: Admin/Category/Edit/5
        [HttpPost]
        public ActionResult Edit(long id, CategoryEditViewModel model)
        {

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // Check category is exist
            Category category = EF.CategoryHandle.FindCategoryById(id);
            if (category == null)
            {
                ModelState.AddModelError("", "Can't find category");
                return View(model);
            }

            // Check name to change is exist already or not
            if (!category.name.Equals(model.Name))
            {
                Category caterogyChecked = EF.CategoryHandle.FindCategoryByName(model.Name);
                if (caterogyChecked != null)
                {
                    ModelState.AddModelError("", $"Category '{model.Name}' is exist already!");
                    return View(model);
                }
            }


            // Check if have image
            string nameOldImg = null;
            if (model.NewImage != null && model.NewImage.ContentLength > 0)
            {
                string NewImgFileName = EF.ImageHandle.SaveImg(model.NewImage, IMAGE_UPLOAD_DIR);
                if (NewImgFileName == null)
                {
                    ModelState.AddModelError("", "Can't upload image!");
                    return View(model);
                }
                nameOldImg = category.image;
                // Update new image
                category.image = NewImgFileName;
            }

            // Update field 
            category.name = model.Name;
            category.description = model.Description;
            category.slug = GerenateUrlSlug(model.Name);

            // Save Changes on Db
            using (var db = new DbModel())
            {
                db.Entry(category).State = System.Data.Entity.EntityState.Modified;
                db.SaveChanges();
            }


            // Remove old Image
            if (nameOldImg != null)
            {
                bool resultDelImg = EF.ImageHandle.DelImg($"{IMAGE_UPLOAD_DIR}/{nameOldImg}");
                model.CurrentImage = category.image;
            }

            ViewBag.successMessage = "Update success!";
            return View(model);
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
