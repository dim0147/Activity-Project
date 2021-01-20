using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using static ActivityWebsite.Authenticate.AuthorizeRoute;
using ActivityWebsite.CustomHelper;
using System.Net;
using ActivityWebsite.Models;
using ActivityWebsite.EF;
using Microsoft.AspNet.Identity;
using ActivityWebsite.Config;

namespace ActivityWebsite.Controllers
{
    public class PostController : Controller
    {
        // GET: Post
        public ActionResult Index()
        {
            return View();
        }

        [Authorize]
        [VerifyUser]
        public ActionResult Create(int id)
        {
            return View();
        }

        [HttpPost]
        [Authorize]
        [VerifyUser]
        [ValidateAntiForgeryToken]
        [ValidateInput(false)]
        public ActionResult Create(int id, CreatePostModel model)
        {
            if (!ModelState.IsValid)
            {
                HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Helper.AddModelError(ModelState);
            }

            using (var db = new DbModel())
            {
                try
                {
                    // Check is owner or not
                    if (!EF.ClubHandle.isClubOwner(id, User.Identity.GetUserId()))
                    {
                        return Helper.ResponseHandle(HttpStatusCode.Forbidden, new
                        {
                            error = true,
                            errors = new string[] { "You don't have permission to create post for this club!" }
                        });
                    }

                    // Check if post title is exist
                    if (EF.PostHandle.TitleIsExist(model.title))
                    {
                        return Helper.ResponseHandle(HttpStatusCode.Forbidden, new
                        {
                            error = true,
                            errors = new string[] { $"Post '{model.title}' is exist already!" }
                        });
                    }

                    using (var transaction = db.Database.BeginTransaction())
                    {

                        // Save header image
                        string headerImgName = EF.ImageHandle.SaveImg(model.headerImg, ConfigurationApp.VIRTUAL_DIR_POST_IMAGE);
                        if(headerImgName == null)
                        {
                            return Helper.ResponseHandle(HttpStatusCode.InternalServerError, new
                            {
                                error = true,
                                errors = new string[] { $"Can't save image, try later!" }
                            });
                        }

                        // Create new post
                        var newPost = new Post
                        {
                            ClubId = id,
                            Owner = User.Identity.GetUserId(),
                            Title = model.title,
                            Text = model.text,
                            Slug = Helper.GerenateClubNameSlug(model.title),
                            HeaderImg = headerImgName
                        };

                        db.Posts.Add(newPost);
                        db.SaveChanges();

                        // Create Post Tag
                        IList<PostTag> postTags = new List<PostTag>();
                        foreach(string tag in model.tags)
                        {
                            postTags.Add(new PostTag
                            {
                                PostId = newPost.Id,
                                name = tag
                            });
                        }
                        db.PostTags.AddRange(postTags);
                        db.SaveChanges();

                        transaction.Commit();
                        return Helper.ResponseHandle(HttpStatusCode.Created, new 
                        { 
                            success = true,
                            messages = new string[] { $"Create new post success!" }
                        });
                    }
                }
                catch(Exception err)
                {
                    return Helper.ResponseHandle(HttpStatusCode.Forbidden, new
                    {
                        error = true,
                        errors = new string[] { err.Message }
                    });
                }
            }
        }

    }
}