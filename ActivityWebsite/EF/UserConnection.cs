using ActivityWebsite.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ActivityWebsite.EF
{
    public class UserConnectionHandle
    {
        public static bool AddUserConnection(string userId, string connectionId)
        {
            using(var db = new DbModel())
            {
                var newUserConnection = new UserConnection
                {
                    Id = connectionId,
                    UserId = userId
                };
                db.UserConnections.Add(newUserConnection);
                db.SaveChanges();
                return true;
            }
        }

        public static bool RemoveConnection(string connectionId)
        {
            using (var db = new DbModel())
            {
                db.UserConnections.RemoveRange(db.UserConnections.Where(c => c.Id == connectionId));
                db.SaveChanges();
                return true;
            }
        }

        public static bool CleanUpConnections()
        {
            try
            {
                using (var context = new DbModel())
                {
                    context.Database.ExecuteSqlCommand("TRUNCATE TABLE UserConnections");
                    return true;
                }
            }
            catch(Exception ex)
            {
                return false;
            }
           
        }
    }
}