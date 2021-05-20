using ActivityWebsite.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ActivityWebsite.Config;
using ActivityWebsite.CustomHelper;

namespace ActivityWebsite.EF
{
    public class CategoryHandle
    {

        public static List<Category> GetAllCategory()
        {
            using (var db = new DbModel())
            {
                return db.Categories.OrderBy(c => c.name).ToList();
            }
        }

        public static Category CreateNewCategory(string name, string description, HttpPostedFile img, string type = "entity")
        {
            using (var db = new DbModel())
            {

                try
                {
                    // Check is exist
                    var categoryFounded = FindCategoryByName(name);
                    if (categoryFounded != null) return null;

                    // Save image
                    string imgName = EF.ImageHandle.SaveImg(img, ConfigurationApp.VIRTUAL_DIR_CATEGORY_IMAGE);
                    if (imgName == null) return null;

                    // Gerenate new slug
                    string slug = Helper.GerenateUrlSlug(name);

                    // Create new category
                    var category = new Category { name = name, description = description, image = imgName, type = type, slug = slug };

                    db.Categories.Add(category);
                    db.SaveChanges();
                    return category;
                }
                catch
                {
                    return null;
                }
            }
        }


        public static Category FindCategoryById(long id)
        {
            using (var db = new DbModel())
            {
                // Check if category is exist
                var query = from ct in db.Categories
                            where ct.Id == id
                            select ct;
                return query.FirstOrDefault();
            }
        }

        public static Category FindCategoryByName(string name)
        {
            using (var db = new DbModel())
            {
                // Check if category is exist
                var query = from ct in db.Categories
                            where ct.name.Equals(name)
                            select ct;
                return query.FirstOrDefault();
            }
        }

        public static object GetAllCategoryByAdmin()
        {
            using (var db = new DbModel())
            {
                return db.Categories
                    .Include("ClubCategories")
                    .Select(c => new
                    {
                        Id = c.Id,
                        Image = ConfigurationApp.URL_DIR_CATEGORY_IMAGE + "/" + c.image,
                        Name = c.name,
                        Description = c.description,
                        Slug = c.slug,
                        Club = c.ClubCategories.Count(),
                        CreatedAt = c.CreatedAt
                    }).ToList();

            }
        }


        public static bool DeleteCategory(int id)
        {
            using (var db = new DbModel())
            {
                try
                {
                    var category = new Category { Id = id };
                    db.Categories.Attach(category);
                    db.Categories.Remove(category);
                    db.SaveChanges();
                    return true;
                }
                catch (Exception error)
                {
                    return false;
                }
            }
        }

    }
}