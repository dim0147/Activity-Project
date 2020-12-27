using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ActivityWebsite.CustomHelper
{
    public class CheckList : ValidationAttribute
    {
        public int MinLength { get; set; }
        public int MaxLength { get; set; }
        public override bool IsValid(object list)
        {
            // Casting to ICollection, return null if not success
            ICollection listCasting = list as ICollection;

            if (listCasting == null)
            {
                return false;
            }

            int totalItem = listCasting.Count;

            if((MinLength != 0 && totalItem < MinLength) || (MaxLength != 0 && totalItem > MaxLength))
            {
                return false;
            }

            return listCasting.Count > 0;
        }

    }
}