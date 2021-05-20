using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web;

namespace ActivityWebsite.Models
{
    public class AddCategoryModel
    {
        [Required]
        public string name { get; set; }

        [Required]
        public string description { get; set; }

        public HttpPostedFile img { get; set; }

    }

}
