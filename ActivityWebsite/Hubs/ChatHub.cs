using Microsoft.AspNet.Identity;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using ActivityWebsite.EF;

namespace ActivityWebsite.Hubs
{
    public class ChatHub : Hub<IChatClient>
    {

        public bool JoinGroupChat(int clubId)
        {
            string userId = Context.User?.Identity.GetUserId();
            string connectionId = Context.ConnectionId;
            bool isValidToJoin = EF.ClubHandle.UserCanSendMessage(clubId, userId);
            if (!isValidToJoin) return false;
            Groups.Add(connectionId, clubId.ToString());
            return true;
        }

        public override Task OnConnected()
        {
            string userId = Context.User?.Identity.GetUserId();
            string connectionId = Context.ConnectionId;
            if(userId != null)
                EF.UserConnectionHandle.AddUserConnection(userId, connectionId);

            return base.OnConnected();
        }

        /*
           https://docs.microsoft.com/en-us/aspnet/signalr/overview/guide-to-the-api/working-with-groups

        */
        public override Task OnDisconnected(bool stopCalled)
        {
            string connectionId = Context.ConnectionId;
            EF.UserConnectionHandle.RemoveConnection(connectionId);

            return base.OnDisconnected(stopCalled);
        }

    }
}