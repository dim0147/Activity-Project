using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ActivityWebsite.EF;

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


    }
}
