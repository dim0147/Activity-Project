using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ActivityWebsite.CustomHelper;
using ActivityWebsite.EF;
using Microsoft.AspNet.Identity;

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


    }
}
