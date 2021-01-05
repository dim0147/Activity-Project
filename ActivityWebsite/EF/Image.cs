using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ActivityWebsite.Models;
using static ActivityWebsite.CustomHelper.Helper;

namespace ActivityWebsite.EF
{
    public class ImageHandle
    {
        public static string SaveImg(HttpPostedFileBase image, string virtualDirUpload)
        {
            try
            {
                string fileName = $"{Guid.NewGuid()}_{GerenateUrlSlug(image.FileName)}";
                image.SaveAs(HttpContext.Current.Server.MapPath($"{virtualDirUpload}/{fileName}"));
                return fileName;
            }
            catch
            {
                return null;
            }
        }

        public static string SaveImg(HttpPostedFile image, string virtualDirUpload)
        {
            try
            {
                string fileName = $"{Guid.NewGuid()}_{GerenateUrlSlug(image.FileName)}";
                image.SaveAs(HttpContext.Current.Server.MapPath($"{virtualDirUpload}/{fileName}"));
                return fileName;
            }
            catch
            {
                return null;
            }
        }


        public static bool DelImg(string nameImage,string virtualImgPath)
        {
            try
            {
                String path = HttpContext.Current.Server.MapPath($"{virtualImgPath}/{nameImage}");
                System.IO.File.Delete(path);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public static bool ImgIsIncludeClub(int clubId, ICollection<int> listImgId)
        {
            using (var db = new DbModel())
            {
                var totalImgs = db.Images
                            .Where(i => listImgId.Contains(i.Id))
                            .Where(i => i.ClubId == clubId)
                            .Count();
                return totalImgs == listImgId.Count();
            }
        }

        public static List<Image> GetClubThumbnail (int clubId)
        {
            using(var db = new DbModel())
            {
                return db.Images.Where(i => i.ClubId == clubId).ToList();
            }
        }

        public static void DeleteImgs(ICollection<int> listImgId)
        {
            using(var db = new DbModel())
            {
                db.Images.RemoveRange(db.Images.Where(i => listImgId.Contains(i.Id)));
                db.SaveChanges();
            }
        }
    
        public static List<Image> GetImgs(ICollection<int> listImgId)
        {
            using (var db = new DbModel())
            {
                return db.Images.Where(i => listImgId.Contains(i.Id)).ToList();
            }
        }
    }
}
