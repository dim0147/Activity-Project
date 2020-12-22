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

namespace ActivityWebsite.Api
{
    public class ImageController : ApiController
    {
        private const string DIR_UPLOAD_DESCRIPTION = "~/Content/Media/Images/Description";

        // GET: api/Image
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Image/5
        public IHttpActionResult Get(int id)
        {
            return Content(HttpStatusCode.Conflict, new { name = "hello" });
        }

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
            string nameImage = EF.ImageHandle.SaveImg(imageUploaded, DIR_UPLOAD_DESCRIPTION);

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
                url = $"/Content/Media/Images/Description/{nameImage}"
            });
        }

        // PUT: api/Image/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Image/5
        public void Delete(int id)
        {
        }
    }
}
