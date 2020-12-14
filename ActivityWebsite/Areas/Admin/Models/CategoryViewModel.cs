using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ActivityWebsite.Areas.Admin.Models
{
    public class CategoryAddViewModel
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [Required]
        [Display(Name = "Image")]
        public HttpPostedFileBase image { get; set; }

        public string Description { get; set; }
    }

    public class CategoryEditViewModel
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [Display(Name = "Current Image")]
        public string CurrentImage { get; set; }

        [Display(Name = "New Image")]
        public HttpPostedFileBase NewImage { get; set; }

        public string Description { get; set; }
    }
}