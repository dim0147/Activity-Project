using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ActivityWebsite.Models
{
    public class CreateCommentAPIModel
    {
        [Required]
        public string text { get; set; }

        [Range(0, 5)]
        public int rate { get; set; }

        public int parentComment { get; set; }

    }
}