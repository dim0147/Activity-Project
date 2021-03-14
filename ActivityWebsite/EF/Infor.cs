using ActivityWebsite.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace ActivityWebsite.EF
{
    public class InforHandle
    {

       public static object GetTotalPostUserClub()
        {
            var db = new DbModel();

            long totalUser = db.AspNetUsers.LongCount();
            long totalClub = db.Clubs.LongCount();
            long totalPost = db.Posts.LongCount();

            return new
            {
                totalUser = totalUser,
                totalClub = totalClub,
                totalPost = totalPost
            };
        }

    }
}