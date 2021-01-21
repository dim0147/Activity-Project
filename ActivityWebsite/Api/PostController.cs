using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ActivityWebsite.Api
{
    public class PostController : ApiController
    {
        [HttpGet]
        [Route("api/post/{postId}")]
        public IHttpActionResult Get(int postId)
        {
            var rs = EF.PostHandle.GetPostDetail(postId);
            return Json(rs);
        }
    }
}
