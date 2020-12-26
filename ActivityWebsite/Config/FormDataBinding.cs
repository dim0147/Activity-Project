using ActivityWebsite.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ActivityWebsite.Config
{
    public class FormDataBinding : DefaultModelBinder
    {
   
        protected override void BindProperty(ControllerContext controllerContext, ModelBindingContext bindingContext, System.ComponentModel.PropertyDescriptor propertyDescriptor)
        {
            // Check if not  a AddressType
            if (propertyDescriptor.PropertyType != typeof(AddressType))
            {
                base.BindProperty(controllerContext, bindingContext, propertyDescriptor);
                return;
            }

            // Get value and check if null
            var value = bindingContext.ValueProvider.GetValue(propertyDescriptor.Name)?.AttemptedValue;
            if (value == null)
            {
                base.BindProperty(controllerContext, bindingContext, propertyDescriptor);
                return;
            }

            // JSON Decode
            try
            {
                AddressType address = JsonConvert.DeserializeObject<AddressType>(value);
                base.SetProperty(controllerContext, bindingContext, propertyDescriptor, address);
            }
            catch
            {
                base.BindProperty(controllerContext, bindingContext, propertyDescriptor);
            }
          
        }


    }
}