using ActivityWebsite.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

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


    }
}