using ActivityWebsite.Config;
using Microsoft.Owin;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Http.ModelBinding;

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

        public AddressType address { get; set; }

        public IEnumerable<string> categories { get; set; }

    }
}