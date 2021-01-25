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
    public class PostController : ApiController
    {
        [HttpGet]
        [Route("api/post/{postId}")]
        public IHttpActionResult Get(int postId)
        {
            var rs = EF.PostHandle.GetPostDetail(postId);
            return Json(rs);
        }

        [HttpGet]
        [Route("api/post/{postId}/comments")]
        public IHttpActionResult GetPostComments(int postId, DateTime? continueTime = null)
        {
            return Json(EF.PostHandle.GetPostComments(postId, User.Identity.GetUserId(), continueTime));
        }

        [HttpPost]
        [Route("api/post/{postId}/comment")]
        [Authorize]
        [VerifyUser]
        public IHttpActionResult CreateComment(int postId, CreateCommentAPIModel model)
        {
            Comment comment = EF.CommentHandle.CreatePostComment(postId, User.Identity.GetUserId(), model.text, model.rate, model.parentComment);
            if(comment == null)
            {
                return Content(HttpStatusCode.InternalServerError, new
                {
                    error = true,
                    errors = new string[] { "Can't create comment post, try again later!" }
                });
            }
            else
                return Json(new {
                    success = true,
                    messages = new string[] {"Create comment success!"},
                    comment = new
                    {
                        Id = comment.Id,
                        CreatedAt = comment.CreatedAt,
                        Rate = comment.Rate,
                        ParentComment = comment.ParentComment,
                        PostId = comment.PostId,
                        Text = comment.Text
                    }
                });
        }
    }
}
