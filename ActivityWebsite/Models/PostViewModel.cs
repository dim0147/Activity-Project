using ActivityWebsite.CustomHelper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ActivityWebsite.Models
{
    public class CreatePostModel
    {
        [Required]
        [StringLength(100, MinimumLength = 5)]
        public string title { get; set; }

        [Required]
        public string text { get; set; }

        [Required]
        [CheckList(MinLength = 1, ErrorMessage = "Tags must have at least 1")]
        public IEnumerable<string> tags { get; set; }

        [Required]
        public HttpPostedFileBase headerImg { get; set; }
    }

    public class EditPostModel
    {
        [Required]
        [StringLength(100, MinimumLength = 5)]
        public string title { get; set; }

        [Required]
        public string text { get; set; }

        [Required]
        [CheckList(MinLength = 1, ErrorMessage = "Tags must have at least 1")]
        public IEnumerable<string> tags { get; set; }

        public HttpPostedFileBase headerImg { get; set; }
    }
}