using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ActivityWebsite.CustomHelper;
using ActivityWebsite.EF;
using ActivityWebsite.Models;
using Microsoft.AspNet.Identity;
using static ActivityWebsite.Authenticate.AuthorizeRoute;

namespace ActivityWebsite.Api
{
    public class ClubController : ApiController
    {
        [HttpGet]
        [Route("api/club/{ClubId}")]
        public IHttpActionResult Get(int ClubId)
        {
            var club = EF.ClubHandle.GetClubById(ClubId);
            return Json(club);
        }

        [HttpGet]
        [Route("api/club/{ClubId}/owner")]
        public IHttpActionResult GetClubOwner(int ClubId)
        {
            // Check club is exist
            if (EF.ClubHandle.GetFullClubById(ClubId) == null)
            {
                return Content(HttpStatusCode.BadRequest, new
                {
                    error = true,
                    errors = new string[] { $"Club not found!" }
                });
            }

            // Check if owner
            if (!EF.ClubHandle.isClubOwner(ClubId, User.Identity.GetUserId()))
            {
                return Content(HttpStatusCode.BadRequest, new
                {
                    error = true,
                    errors = new string[] { $"You don't have permission to edit this club!" }
                });
            }

            var club = EF.ClubHandle.GetClubById(ClubId);
            return Json(club);
        }

        [HttpGet]
        [Authorize]
        [VerifyUser]
        [Route("api/club/{ClubId}/following")]
        public IHttpActionResult GetDefaultUserFollowing(int ClubId)
        {
            return Json(new
            {
                success = true,
                follow = EF.ClubHandle.GetUserFollowClub(User.Identity.GetUserId(), ClubId)
            }); ;
        }

        [HttpPost]
        [Authorize]
        [VerifyUser]
        [Route("api/club/{ClubId}/following")]
        public IHttpActionResult CreateDefaultUserFollowing(int ClubId, FollowClubAPIModel model)
        {
            if(!ModelState.IsValid)
            {
                return Content(HttpStatusCode.BadRequest, new
                {
                    error = true,
                    errors = new string[] { "Missing field!" }
                });
            }

            if(model.isFollow)
            {
                var result = EF.ClubHandle.CreateUserFollowClub(User.Identity.GetUserId(), ClubId);
                if (result == null)
                {
                    return Content(HttpStatusCode.InternalServerError, new
                    {
                        error = true,
                        errors = new string[] { "Cannot follow club now please try again later" }
                    });
                }
                else
                {
                    return Json(new
                    {
                        success = true,
                        follow = result
                    });
                }
            }
            else
            {
                var result = EF.ClubHandle.RemoveUserFollowClub(User.Identity.GetUserId(), ClubId);
                if (!result)
                {
                    return Content(HttpStatusCode.InternalServerError, new
                    {
                        error = true,
                        errors = new string[] { "Cannot Unfollow club now please try again later" }
                    });
                }
                else
                {
                    return Json(new
                    {
                        success = true,
                        messages = new string[] {"Unfollow success"}
                    });
                }
            }
        }

        [HttpGet]
        [Authorize]
        [VerifyUser]
        [Route("api/club/{ClubId}/comments")]
        public IHttpActionResult GetClubComments(int ClubId, DateTime? continueTime = null)
        {
            return Json(EF.ClubHandle.GetClubComments(ClubId, User.Identity.GetUserId(), continueTime));
        }

        [HttpPost]
        [Authorize]
        [VerifyUser]
        [Route("api/club/{ClubId}/comment")]
        public IHttpActionResult CreateCommentRate(int ClubId, CreateCommentRateAPIModel model)
        {
            if(!ModelState.IsValid)
            {
                return Content(HttpStatusCode.BadRequest, new
                {
                    error = true,
                    errors = new string[] {"Request is invalid!"}
                });
            }

            var rate = EF.ClubHandle.GetUserRateClub(User.Identity.GetUserId(), ClubId);
            if(rate != null)
            {
                return Content(HttpStatusCode.BadRequest, new
                {
                    error = true,
                    errors = new string[] { "You rate already!!" }
                });
            }

            var newComment = EF.ClubHandle.CreateUserRateClub(User.Identity.GetUserId(), ClubId, model.text, model.rate);
            if(newComment == null)
            {
                return Content(HttpStatusCode.InternalServerError, new
                {
                    error = true,
                    errors = new string[] { "Can't create, please try again later!!" }
                });
            }

            return Json(new { 
                success = true,
                messages = new string[] {"Create comment success!"}
            });
        }
    }
}
