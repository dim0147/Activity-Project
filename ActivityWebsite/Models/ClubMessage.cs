//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ActivityWebsite.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class ClubMessage
    {
        public int Id { get; set; }
        public int ClubId { get; set; }
        public string Owner { get; set; }
        public string Text { get; set; }
        public System.DateTime CreatedAt { get; set; }
    
        public virtual AspNetUser AspNetUser { get; set; }
        public virtual Club Club { get; set; }
    }
}
