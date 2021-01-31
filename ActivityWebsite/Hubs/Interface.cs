using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace ActivityWebsite.Hubs
{
    public interface IChatClient
    {
        Task ReceiveMessage(object message);
    }
}