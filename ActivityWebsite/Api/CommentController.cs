using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ActivityWebsite.Models;
using Microsoft.AspNet.Identity;
using static ActivityWebsite.Authenticate.AuthorizeRoute;

namespace ActivityWebsite.Api
{
    public class CommentController : ApiController
    {

        [HttpGet]
        [Route("api/comment/{commentId}/replies")]
        public IHttpActionResult GetRepliesComment(int commentId, DateTime? timeContinue = null)
        {
            var replies = EF.CommentHandle.GetRepliesComment(commentId, timeContinue, User.Identity.GetUserId());
            return Json(new { 
                success = true,
                replies = replies
            });
        }

        public class LikeCommentModel
        {
            public bool isLike { get; set; }
        }

        [HttpPost]
        [Authorize]
        [VerifyUser]
        [Route("api/comment/{commentId}/like")]
        public IHttpActionResult CommentLike(int commentId, LikeCommentModel model)
        {
            bool success = EF.CommentHandle.LikeComment(commentId, User.Identity.GetUserId(), model.isLike);
            if (success) return Json(new
            {
                success = true,
                messages = new string[] { "Operation success!" }
            });
            else return Content(HttpStatusCode.InternalServerError, new
            {
                error = true,
                errors = new string[] { "Please try again later!" }
            });
        }
    }
}