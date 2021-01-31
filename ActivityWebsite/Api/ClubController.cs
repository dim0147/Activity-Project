using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ActivityWebsite.CustomHelper;
using ActivityWebsite.EF;
using ActivityWebsite.Hubs;
using ActivityWebsite.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.SignalR;
using static ActivityWebsite.Authenticate.AuthorizeRoute;

namespace ActivityWebsite.Api
{
    public class ClubController : ApiController
    {
        private IHubContext<IChatClient> _chatHub { get; set; }

        public ClubController()
        {
            _chatHub = GlobalHost.ConnectionManager.GetHubContext<ChatHub, IChatClient>();
        }

        [HttpGet]
        [Route("api/club/{ClubId}")]
        public IHttpActionResult Get(int ClubId)
        {
            //_chatHub.Clients.All.ReceiveMessage(new ChatMessage { User = "Noob", Message = "Run from controller" });
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
        [System.Web.Http.Authorize]
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
        [System.Web.Http.Authorize]
        [VerifyUser]
        [Route("api/club/{ClubId}/following")]
        public IHttpActionResult CreateDefaultUserFollowing(int ClubId, FollowClubAPIModel model)
        {
            if (!ModelState.IsValid)
            {
                return Content(HttpStatusCode.BadRequest, new
                {
                    error = true,
                    errors = new string[] { "Missing field!" }
                });
            }

            if (model.isFollow)
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
                        messages = new string[] { "Unfollow success" }
                    });
                }
            }
        }

        [HttpGet]
        [System.Web.Http.Authorize]
        [VerifyUser]
        [Route("api/club/{ClubId}/comments")]
        public IHttpActionResult GetClubComments(int ClubId, DateTime? continueTime = null)
        {
            return Json(EF.ClubHandle.GetClubComments(ClubId, User.Identity.GetUserId(), continueTime));
        }

        [HttpPost]
        [System.Web.Http.Authorize]
        [VerifyUser]
        [Route("api/club/{ClubId}/comment")]
        public IHttpActionResult CreateCommentRate(int ClubId, CreateCommentRateAPIModel model)
        {
            if (!ModelState.IsValid)
            {
                return Content(HttpStatusCode.BadRequest, new
                {
                    error = true,
                    errors = new string[] { "Request is invalid!" }
                });
            }

            var rate = EF.ClubHandle.GetUserRateClub(User.Identity.GetUserId(), ClubId);
            if (rate != null)
            {
                return Content(HttpStatusCode.BadRequest, new
                {
                    error = true,
                    errors = new string[] { "You rate already!!" }
                });
            }

            var newComment = EF.ClubHandle.CreateUserRateClub(User.Identity.GetUserId(), ClubId, model.text, model.rate);
            if (newComment == null)
            {
                return Content(HttpStatusCode.InternalServerError, new
                {
                    error = true,
                    errors = new string[] { "Can't create, please try again later!!" }
                });
            }

            return Json(new
            {
                success = true,
                messages = new string[] { "Create comment success!" }
            });
        }

        [HttpGet]
        [System.Web.Http.Authorize]
        [VerifyUser]
        [Route("api/club/{ClubId}/user")]
        public IHttpActionResult GetUserRoleInClub(int ClubId)
        {
            var isOwner = EF.ClubHandle.isClubOwner(ClubId, User.Identity.GetUserId());
            if (isOwner)
            {
                return Json(new
                {
                    success = true,
                    role = "Owner"
                });
            }
            var isMember = EF.ClubHandle.UserIsFollowClub(ClubId, User.Identity.GetUserId());
            if (isMember)
            {
                return Json(new
                {
                    success = true,
                    role = "Member"
                });
            }
            else
            {
                return Json(new
                {
                    success = true,
                    role = (string)null
                });
            }

        }
        
        [HttpGet]
        [System.Web.Http.Authorize]
        [VerifyUser]
        [Route("api/club/{ClubId}/members")]
        public IHttpActionResult GetClubMembers(int ClubId)
        {
            return Json(new
            {
                success = true,
                members = EF.ClubHandle.GetClubMember(ClubId)
            });
        }

        [HttpGet]
        [System.Web.Http.Authorize]
        [VerifyUser]
        [Route("api/club/{ClubId}/chatbox/message")]
        public IHttpActionResult GetClubMessages(int ClubId, [FromUri]DateTime? continueTime = null)
        {
            var rs = EF.ClubHandle.GetClubMessages(ClubId, continueTime);
            return Json(new
            {
                success = true,
                data = rs
            });
        }

        [HttpPost]
        [System.Web.Http.Authorize]
        [VerifyUser]
        [Route("api/club/{ClubId}/chatbox/message")]
        public IHttpActionResult CreateMessageInChatbox(int ClubId, CreateMessageClubAPIModel model)
        {
            if(!ModelState.IsValid)
            {
                Content(HttpStatusCode.BadRequest, new { 
                    error = true,
                    errors = new string[] {"Request invalid!"}
                });
            }
            if (!EF.ClubHandle.UserCanSendMessage(ClubId, User.Identity.GetUserId()))
            {
                return Content(HttpStatusCode.NotAcceptable, new
                {
                    error = true,
                    errors = new string[] { "You don't have permission to send message to this group!" }
                });
            }

            var newMessage = EF.ClubHandle.CreateClubMessage(ClubId, User.Identity.GetUserId(), model.message);

            _chatHub.Clients.Group(ClubId.ToString()).ReceiveMessage(newMessage);
            return Json(new
            {
                success = true,
                message = newMessage
            });
        }
    
    
    }
}
