using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ActivityWebsite.Models;
using ActivityWebsite.CustomHelper;
using ActivityWebsite.Config;
using System.Data.Entity;

namespace ActivityWebsite.EF
{
    public class PostHandle
    {
        public static bool TitleIsExist(string title)
        {
            using (var db = new DbModel())
            {
                string titleSlug = Helper.GerenateClubNameSlug(title);
                var post = db.Posts.Where(p => p.Slug == titleSlug).FirstOrDefault();
                return post != null;
            }
        }

        public static object GetPostDetail(int postId)
        {
            using (var db = new DbModel())
            {
                return db.Posts
                        .Include("Club")
                        .Include("AspNetUser")
                        .Include("PostTags")
                        .Select(p => new
                        {
                            Id = p.Id,
                            Title = p.Title,
                            Text = p.Text,
                            HeaderImg = ConfigurationApp.URL_DIR_POST_IMAGE + "/" + p.HeaderImg,
                            Slug = p.Slug,
                            CreatedAt = p.CreatedAt,
                            UpdatedAt = p.UpdatedAt,
                            Tags = p.PostTags.Select(tag => new
                            {
                                Name = tag.name
                            }),
                            Owner = new
                            {
                                Id = p.AspNetUser.Id,
                                UserName = p.AspNetUser.UserName,
                                Name = p.AspNetUser.DisplayName,
                                CreatedAt = p.AspNetUser.CreatedAt,
                                AuthenticateType = p.AspNetUser.authenticateType,
                                status = p.AspNetUser.status,
                            }
                        })
                        .Where(p => p.Id == postId)
                        .Where(p => p.Owner.status == "normal")
                        .FirstOrDefault();
            }
        }

        public static Post GetFullPostBySlug(string slug)
        {
            using (var db = new DbModel())
            {
                return db.Posts.Where(p => p.Slug == slug).FirstOrDefault();
            }
        }


        public static Post GetFullPostById(int postId)
        {
            using (var db = new DbModel())
            {
                return db.Posts.Where(p => p.Id == postId).FirstOrDefault();
            }
        }

        public static bool AddPostTagsToPost(int postId, IEnumerable<string> tagsList, DbModel dbContext)
        {
            try
            {
                var db = dbContext == null ? new DbModel() : dbContext;
                IList<PostTag> postTags = new List<PostTag>();
                foreach (string tag in tagsList)
                {
                    postTags.Add(new PostTag
                    {
                        PostId = postId,
                        name = tag
                    });
                }
                db.PostTags.AddRange(postTags);
                db.SaveChanges();
                if (dbContext == null)
                    db.Dispose();
                return true;
            }
            catch (Exception err)
            {
                return false;
            }
        }

        public static bool RemoveAllPostTags(int postId, DbModel dbContext)
        {
            try
            {
                var db = dbContext == null ? new DbModel() : dbContext;
                db.PostTags.RemoveRange(db.PostTags.Where(pt => pt.PostId == postId));
                db.SaveChanges();
                if (dbContext == null)
                    db.Dispose();
                return true;

            }
            catch (Exception err)
            {
                return false;
            }
        }

        public static object GetPostComments(int postId, string userId, DateTime? continueTime)
        {
            using (var db = new DbModel())
            {
                var query = db.Comments
                    .Include("AspNetUser")
                    .Include("UserLikes")
                    .Include("Comments1.AspNetUser")
                    .Include("Comments1.UserLikes")
                    .Where(c => c.PostId == postId && c.ParentComment == null);

                if (continueTime != null)
                {
                    query = query.Where(c => DateTime.Compare(c.CreatedAt, (DateTime)continueTime) < 0);
                }
                var comment = query.Select(c => new
                {
                    Id = c.Id,
                    Text = c.Text,
                    Rate = c.Rate,
                    CreatedAt = c.CreatedAt,
                    Owner = new
                    {
                        Id = c.AspNetUser.Id,
                        UserName = c.AspNetUser.UserName,
                        Name = c.AspNetUser.DisplayName,
                        CreatedAt = c.AspNetUser.CreatedAt,
                        AuthenticateType = c.AspNetUser.authenticateType,
                        status = c.AspNetUser.status,
                    },
                    likes = c.UserLikes.Count(),
                    replies = c.Comments1.Count(),
                    isLiked = (userId != null && c.UserLikes.Any(l => l.Owner == userId)) ? true : false
                })
                    .Where(c => c.Owner.status == "normal").OrderByDescending(c => c.CreatedAt).Take(5);
                var listReplies = comment.ToList();
                var lastCreatedTime = listReplies.LastOrDefault()?.CreatedAt;
                int totalLeft = lastCreatedTime != null ? db.Comments.Where(c => c.PostId == postId && c.ParentComment == null && DateTime.Compare(c.CreatedAt, (DateTime)lastCreatedTime) < 0).Count() : 0;
                return new
                {
                    comments = listReplies,
                    totalLeft = totalLeft,
                    continueTime = totalLeft > 0 ? lastCreatedTime : null
                };
            }
        }

        public static object GetTopPost()
        {
            using (var db = new DbModel())
            {
                return db.Posts
                    .Include("PostTags")
                    .Include("AspNetUser")
                    .Include("Club")
                    .Include("Club.AspNetUser")
                    .Include("Comments")
                    .Where(p => p.Club.AspNetUser.status == "normal" && p.AspNetUser.status == "normal")
                    .Select(p => new
                    {
                        Id = p.Id,
                        Title = p.Title,
                        Text = p.Text,
                        Slug = p.Slug,
                        HeaderImg = ConfigurationApp.URL_DIR_POST_IMAGE + "/" + p.HeaderImg,
                        TotalRate = p.Comments.Where(c => c.Rate > 0).Count(),
                        AverageRate = (int?)p.Comments.Where(c => c.Rate > 0).Average(c => c.Rate),
                        Tags = p.PostTags.Select(tag => new
                        {
                            Id = tag.Id,
                            Name = tag.name
                        }),
                        Club = new
                        {
                            Id = p.Club.Id,
                            Slug = p.Club.Slug,
                            Name = p.Club.Name
                        },
                        Owner = new
                        {
                            Id = p.AspNetUser.Id,
                            UserName = p.AspNetUser.UserName,
                            Name = p.AspNetUser.DisplayName,
                            CreatedAt = p.AspNetUser.CreatedAt,
                            AuthenticateType = p.AspNetUser.authenticateType,
                            status = p.AspNetUser.status,
                        }
                    })
                    .Where(p => p.TotalRate > 0)
                    .OrderByDescending(p => new { p.TotalRate, p.AverageRate })
                    .Take(4)
                    .ToList();
            }
        }

        public static object PostSearch(string title, string[] tags, int size)
        {
            using (var db = new DbModel())
            {
                var query = db.Posts
                        .Include("PostTags")
                        .Include("AspNetUser")
                        .Include("Club")
                        .Include("Club.AspNetUser")
                        .Include("Comments")
                        .Where(p => p.Club.AspNetUser.status == "normal" && p.AspNetUser.status == "normal");

                if (title != null)
                    query = query.Where(p => p.Title.ToLower().Contains(title.ToLower()));
                if (tags != null && tags.Length > 0)
                    query = query.Where(p => p.PostTags.Any(pt => tags.Contains(pt.name)));

                return query.Select(p => new
                {
                    Id = p.Id,
                    Title = p.Title,
                    Text = p.Text,
                    Slug = p.Slug,
                    HeaderImg = ConfigurationApp.URL_DIR_POST_IMAGE + "/" + p.HeaderImg,
                    TotalRate = p.Comments.Where(c => c.Rate > 0).Count(),
                    AverageRate = (int?)p.Comments.Where(c => c.Rate > 0).Average(c => c.Rate),
                    Tags = p.PostTags.Select(tag => new
                    {
                        Id = tag.Id,
                        Name = tag.name
                    }),
                    Club = new
                    {
                        Id = p.Club.Id,
                        Slug = p.Club.Slug,
                        Name = p.Club.Name
                    },
                    Owner = new
                    {
                        Id = p.AspNetUser.Id,
                        UserName = p.AspNetUser.UserName,
                        Name = p.AspNetUser.DisplayName,
                        CreatedAt = p.AspNetUser.CreatedAt,
                        AuthenticateType = p.AspNetUser.authenticateType,
                        status = p.AspNetUser.status,
                    }
                })
                .Take(size)
                .ToList();
            }
        }
    }
}