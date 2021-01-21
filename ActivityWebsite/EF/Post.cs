using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ActivityWebsite.Models;
using ActivityWebsite.CustomHelper;
using ActivityWebsite.Config;

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
    }
}