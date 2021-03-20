using ActivityWebsite.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ActivityWebsite.Config;

namespace ActivityWebsite.EF
{
    public class CategoryHandle
    {

        public static List<Category> GetAllCategory()
        {
            using(var db = new DbModel())
            {
                return db.Categories.OrderBy(c => c.name).ToList();
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
            using(var db = new DbModel())
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
            using(var db = new DbModel())
            {
                try
                {
                    var category = new Category { Id = id };
                    db.Categories.Attach(category);
                    db.Categories.Remove(category);
                    db.SaveChanges();
                    return true;
                }
                catch(Exception error)
                {
                    return false;
                }
            }
        }

    }
}