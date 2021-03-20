using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using static ActivityWebsite.Authenticate.AuthorizeRoute;

namespace ActivityWebsite.Api
{
    public class ReportController : ApiController
    {
        [HttpGet]
        [Route("api/report/get-all-report")]
        [Authorize(Roles = "Admin,Moderator")]
        [VerifyUser]
        public IHttpActionResult GetAllReport()
        {
            return Json(EF.ReportHandle.GetAllReport());
        }

        [HttpDelete]
        [Route("api/report/delete/{id}")]
        [Authorize(Roles = "Admin,Moderator")]
        [VerifyUser]
        public IHttpActionResult DeleteReport(int id)
        {
            return Json(EF.ReportHandle.DeleteReport(id));
        }
    }
}
