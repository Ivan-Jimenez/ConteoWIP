using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ConteoWIP.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index() => RedirectToAction("Dashboard");
        public ActionResult Dashboard() => View();
        public PartialViewResult Count() => PartialView();
        public PartialViewResult Concilition() => PartialView();
    }
}