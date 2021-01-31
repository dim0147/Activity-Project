using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ActivityWebsite.EF;

namespace ActivityWebsite
{
    public class StartupSetup
    {
        public static void Start()
        {
            EF.UserConnectionHandle.CleanUpConnections();
        }
    }
}