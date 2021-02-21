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
using System.Threading.Tasks;

namespace ActivityWebsite.Controllers
{
    public class PostController : Controller
    {
        [HttpGet]
        [Authorize]
        [VerifyUser]
        [Route("post/create")]
        public ActionResult Create(int id)
        {
            return View();
        }

        [HttpPost]
        [Route("post/create")]
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
                        if (headerImgName == null)
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
                        if (!EF.PostHandle.AddPostTagsToPost(newPost.Id, model.tags, db))
                        {
                            return Helper.ResponseHandle(HttpStatusCode.InternalServerError, new
                            {
                                error = true,
                                errors = new string[] { $"Can't create post tag, try later!" }
                            });
                        }

                        transaction.Commit();
                        return Helper.ResponseHandle(HttpStatusCode.Created, new
                        {
                            success = true,
                            messages = new string[] { $"Create new post success!" }
                        });
                    }
                }
                catch (Exception err)
                {
                    return Helper.ResponseHandle(HttpStatusCode.Forbidden, new
                    {
                        error = true,
                        errors = new string[] { err.Message }
                    });
                }
            }
        }

        [HttpDelete]
        [Route("post/delete/{id}")]
        [Authorize]
        [VerifyUser]
        public ActionResult Delete(int id)
        {
            bool isSuccess = EF.PostHandle.DeletePost(id);
            if (isSuccess)
            {
                return Helper.ResponseHandle(HttpStatusCode.OK, new
                {
                    success = true
                });
            }
            else
            {
                return Helper.ResponseHandle(HttpStatusCode.InternalServerError, new
                {
                    error = true
                });
            }

        }

        [Route("post/{slug}")]
        public ActionResult Detail(string slug)
        {
            int id = EF.PostHandle.GetFullPostBySlug(slug)?.Id ?? -1;
            ViewBag.PostId = id;
            return View();
        }

        [Route("post/{slug}/edit")]
        [Authorize]
        [VerifyUser]
        public ActionResult Edit(string slug)
        {
            int id = EF.PostHandle.GetFullPostBySlug(slug)?.Id ?? -1;
            ViewBag.PostId = id;
            return View();
        }

        [HttpPost]
        [Route("post/edit/{postId}")]
        [Authorize]
        [VerifyUser]
        [ValidateAntiForgeryToken]
        [ValidateInput(false)]
        public ActionResult Edit(int postId, EditPostModel model)
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
                    using (var transaction = db.Database.BeginTransaction())
                    {

                        // Get Post
                        var post = EF.PostHandle.GetFullPostById(postId);
                        if (post == null)
                            return Helper.ResponseHandle(HttpStatusCode.NotFound, new
                            {
                                error = true,
                                errors = new string[] { "Post not found" }
                            });

                        // Check is club owner or not
                        if (!EF.ClubHandle.isClubOwner(post.ClubId, User.Identity.GetUserId()))
                        {
                            return Helper.ResponseHandle(HttpStatusCode.Forbidden, new
                            {
                                error = true,
                                errors = new string[] { "You don't have permission to edit post for this club!" }
                            });
                        }


                        // Edit post
                        post.Title = model.title;
                        post.Text = model.text;

                        // Header image handle
                        string oldHeaderImg = null;
                        if (model.headerImg != null)
                        {
                            // Save header image
                            string headerImgName = EF.ImageHandle.SaveImg(model.headerImg, ConfigurationApp.VIRTUAL_DIR_POST_IMAGE);
                            if (headerImgName == null)
                            {
                                return Helper.ResponseHandle(HttpStatusCode.InternalServerError, new
                                {
                                    error = true,
                                    errors = new string[] { $"Can't save image, try later!" }
                                });
                            }
                            // Delete old header image
                            oldHeaderImg = post.HeaderImg;
                            post.HeaderImg = headerImgName;
                        }
                        db.Entry(post).State = System.Data.Entity.EntityState.Modified;
                        db.SaveChanges();

                        // Remove all tag
                        if (!EF.PostHandle.RemoveAllPostTags(post.Id, db))
                        {
                            return Helper.ResponseHandle(HttpStatusCode.InternalServerError, new
                            {
                                error = true,
                                errors = new string[] { $"Can't delete post tag, try later!" }
                            });
                        }

                        // Create Post Tag
                        if (!EF.PostHandle.AddPostTagsToPost(post.Id, model.tags, db))
                        {
                            return Helper.ResponseHandle(HttpStatusCode.InternalServerError, new
                            {
                                error = true,
                                errors = new string[] { $"Can't create post tag, try later!" }
                            });
                        }

                        transaction.Commit();

                        // Delete old header image if have
                        if (oldHeaderImg != null)
                        {
                            EF.ImageHandle.DelImg(oldHeaderImg, ConfigurationApp.VIRTUAL_DIR_POST_IMAGE);
                        }

                        return Helper.ResponseHandle(HttpStatusCode.OK, new
                        {
                            success = true,
                            messages = new string[] { $"Edit post success!" }
                        });
                    }
                }
                catch (Exception err)
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