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
    
    public partial class Image
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Nullable<int> ClubId { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public string Type { get; set; }
    
        public virtual Club Club { get; set; }
    }
}
