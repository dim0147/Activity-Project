using ActivityWebsite.Config;
using Microsoft.Owin;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Http.ModelBinding;
using ActivityWebsite.CustomHelper;
using System.Web.Mvc;

namespace ActivityWebsite.Models
{
    public class AddressType
    {
        public string name { get; set; }
        public double lat { get; set; }
        public double lng { get; set; }
    }

    public class CreateClubModel
    {

        [Required]
        [StringLength(50)]
        public string name { get; set; }

        [Required(ErrorMessage = "Please enter operation hours")]
        [StringLength(60)]
        public string operationHours { get; set; }

        [Required(ErrorMessage = "Please enter establish time")]
        public DateTime establishedAt { get; set; }
        
        [Required(ErrorMessage = "Please enter some description")]
        public string description { get; set; }

        [Required(ErrorMessage = "Please enter your club's address")]  
        public AddressType address { get; set; }

        [Required(ErrorMessage = "Please select header image")]
        public HttpPostedFileBase headerImg { get; set; }

        [Required(ErrorMessage = "Please enter some thumbnail images")]
        public ICollection<HttpPostedFileBase> thumbnails { get; set; }

        [Required]
        [CheckList(MinLength = 1, MaxLength = 30, ErrorMessage = "Category must at least 1 and can't more then 30")]
        public IEnumerable<int> categories { get; set; }
    }

    public class EditClubModel
    {
        [Required]
        [StringLength(50)]
        public string name { get; set; }

        [Required(ErrorMessage = "Please enter operation hours")]
        [StringLength(60)]
        public string operationHours { get; set; }

        [Required(ErrorMessage = "Please enter establish time")]
        public DateTime establishedAt { get; set; }

        [Required(ErrorMessage = "Please enter some description")]
        public string description { get; set; }

        [Required(ErrorMessage = "Please enter your club's address")]
        public AddressType address { get; set; }

        public HttpPostedFileBase headerImg { get; set; }

        public ICollection<HttpPostedFileBase> thumbnails { get; set; }

        public ICollection<int> listImgIdNeedDelete { get; set; }

        [Required]
        [CheckList(MinLength = 1, MaxLength = 30, ErrorMessage = "Category must at least 1 and can't more then 30")]
        public IEnumerable<int> categories { get; set; }
    }
    public class FollowClubAPIModel
    {

        [Required]
        public bool isFollow { get; set; }
    }

    public class CreateCommentRateAPIModel
    {
        [Required]
        [Range(0, 5)]
        public int rate { get; set; }

        [Required]
        public string text { get; set; }
    }

    public class CreateMessageClubAPIModel
    {
        [Required]
        public string message { get; set; }
    }
}