using Microsoft.AspNet.Identity;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace ActivityWebsite.Hubs
{
    public class ChatHub : Hub<IChatClient>
    {

        public void SendMess(ChatMessage message)
        {
            Clients.All.ReceiveMessage(message);
        }

        public override Task OnConnected()
        {
            var id = Context.User?.Identity.GetUserId();
            var name = Context.User?.Identity.Name;
            string idC = Context.ConnectionId;
            return base.OnConnected();
        }

        /*
           https://docs.microsoft.com/en-us/aspnet/signalr/overview/guide-to-the-api/working-with-groups

        */
        public override Task OnDisconnected(bool stopCalled)
        {
            var id = Context.User?.Identity.GetUserId();
            var name = Context.User?.Identity.Name;
            string idC = Context.ConnectionId;
            return base.OnDisconnected(stopCalled);
        }

    }
}