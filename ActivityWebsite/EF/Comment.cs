using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using ActivityWebsite.Models;

namespace ActivityWebsite.EF
{
    public class CommentHandle
    {
        public static Comment CreatePostComment(int postId, string userId, string comment, int? rate, int? parentComment)
        {
            try
            {
                using (var db = new DbModel())
                {
                    var newComment = new Comment
                    {
                        Text = comment,
                        Rate = rate,
                        Owner = userId,
                        PostId = postId,
                        ParentComment = parentComment > 0 ? parentComment : null,
                        Type = "post-comment"
                    };
                    db.Comments.Add(newComment);
                    db.SaveChanges();
                    return newComment;
                }
            }
            catch (Exception e)
            {
                return null;
            }

        }


        public static object GetRepliesComment(int parentCommentId, DateTime? continueTime, string userId)
        {
            using (var db = new DbModel())
            {
                var query = db.Comments
                            .Include("AspNetUser")
                            .Include("UserLikes")
                            .Where(c => c.ParentComment == parentCommentId);
                if(continueTime != null)
                {
                    query = query.Where(c => DateTime.Compare(c.CreatedAt, (DateTime)continueTime) > 0);
                }
                           
                var replies = query.Select(c => new
                {
                    Id = c.Id,
                    Text = c.Text,
                    Rate = c.Rate,
                    CreatedAt = c.CreatedAt,
                    likes = c.UserLikes.Count(),
                    Owner = new
                    {
                        Id = c.AspNetUser.Id,
                        UserName = c.AspNetUser.UserName,
                        Name = c.AspNetUser.DisplayName,
                        CreatedAt = c.AspNetUser.CreatedAt,
                        AuthenticateType = c.AspNetUser.authenticateType,
                        status = c.AspNetUser.status,
                    },
                    isLiked = (userId != null && c.UserLikes.Any(l => l.Owner == userId)) ? true : false
                }).Where(c => c.Owner.status == "normal").OrderBy(c => c.CreatedAt).Take(3);
                var listReplies = replies.ToList();
                var lastCreatedTime = listReplies.LastOrDefault()?.CreatedAt;
                int totalLeft = lastCreatedTime != null ? db.Comments.Where(c => c.ParentComment == parentCommentId && DateTime.Compare(c.CreatedAt, (DateTime)lastCreatedTime) > 0).Count() : 0;
                return new { 
                    data = listReplies,
                    totalLeft = totalLeft,
                    continueTime = totalLeft > 0 ? lastCreatedTime : null
                };
            }
        }

        public static bool LikeComment(int commentId, string userId, bool isLike)
        {
            try
            {
                using (var db = new DbModel())
                {
                    if (isLike)
                    {
                        db.UserLikes.Add(new UserLike
                        {
                            CommentId = commentId,
                            Owner = userId
                        });
                        db.SaveChanges();
                    }
                    else
                    {
                        db.UserLikes.RemoveRange(db.UserLikes.Where(l => l.CommentId == commentId && l.Owner == userId));
                        db.SaveChanges();
                    }
                    return true;
                }
            }
            catch (Exception e)
            {
                return false;
            }
        }
    }
}