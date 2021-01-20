using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ActivityWebsite.Models;
using ActivityWebsite.CustomHelper;

namespace ActivityWebsite.EF
{
    public class PostHandle
    {
        public static bool TitleIsExist(string title)
        {
            using(var db = new DbModel())
            {
                string titleSlug = Helper.GerenateClubNameSlug(title);
                var post = db.Posts.Where(p => p.Slug == titleSlug).FirstOrDefault();
                return post != null;
            }
        }
    }
}