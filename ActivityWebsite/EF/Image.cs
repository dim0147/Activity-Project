using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
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


        public static bool DelImg(string virtualImgPath)
        {
            try
            {
                String path = HttpContext.Current.Server.MapPath(virtualImgPath);
                System.IO.File.Delete(path);
                return true;
            }
            catch
            {
                return false;
            }
        }

    }
}
