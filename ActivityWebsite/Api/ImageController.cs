using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using ActivityWebsite.Models;
using static ActivityWebsite.CustomHelper.Helper;
using ActivityWebsite.EF;
using ActivityWebsite.Config;

namespace ActivityWebsite.Api
{
    public class ImageController : ApiController
    {

        // POST: api/Image
        public IHttpActionResult Post(string typeUpload)
        {
            var imageUploaded = HttpContext.Current.Request.Files["upload"];
            
            // Check if image exist
            if(imageUploaded == null)
            {
                return Content(HttpStatusCode.BadRequest, new
                {
                    uploaded = false,
                    error = new
                    {
                        message = "Don't have image"
                    }
                });
            }

            // Save image to storage
            string nameImage = EF.ImageHandle.SaveImg(imageUploaded, ConfigurationApp.VIRTUAL_DIR_CLUB_DESCRIPTION_IMAGE);

            // Upload failed
            if(nameImage == null)
            {
                return Content(HttpStatusCode.InternalServerError, new
                {
                    uploaded = false,
                    error = new
                    {
                        message = "Can't upload image, please upload later"
                    }
                });
            }

            // Upload success
            return Content(HttpStatusCode.OK, new
            {
                uploaded = true,
                url = $"{ConfigurationApp.URL_DIR_CLUB_DESCRIPTION_IMAGE}/{nameImage}"
            });
        }

    }
}
