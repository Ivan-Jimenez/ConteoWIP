using System.Web.Mvc;

namespace ConteoWIP.Areas.ConteoWIP
{
    public class ConteoWIPAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "ConteoWIP";
            }
        }
        
        public override void RegisterArea(AreaRegistrationContext context) 
        {
            context.MapRoute(
                "ConteoWIP_default",
                "ConteoWIP/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}