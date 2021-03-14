using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ActivityWebsite.Api
{
    public class InfoController : ApiController
    {
        [HttpGet]
        public IHttpActionResult HomePage()
        {
            return Json(EF.InforHandle.GetTotalPostUserClub());
        }


    }
}
