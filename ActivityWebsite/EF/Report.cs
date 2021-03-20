using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ActivityWebsite.Models;

namespace ActivityWebsite.EF
{
    public class ReportHandle
    {
        public static object GetAllReport()
        {
            using(var db = new DbModel())
            {
                return db.Reports
                    .Include("Club")
                    .Include("AspNetUser")
                    .Include("AspNetUser1")
                    .Select(r => new
                    {
                        Id = r.Id,
                        Owner = r.AspNetUser.DisplayName,
                        Reason = r.Reason,
                        Replier = r.AspNetUser1.DisplayName,
                        Club = new
                        {
                            Id = r.Club.Id,
                            Slug = r.Club.Slug,
                            Name = r.Club.Name
                        },
                        Status = r.Status,
                        CreatedAt = r.CreatedAt,
                        UpdatedAt = r.UpdatedAt
                    }).ToList();
            }
        }

        public static bool DeleteReport(int id)
        {
            using(var db = new DbModel())
            {
                try
                {
                    var report = new Report { Id = id };
                    db.Reports.Attach(report);
                    db.Reports.Remove(report);
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